# app.py
from flask import Flask, Response, stream_with_context, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import json
import time
import importlib

from model_loader import load_models

app = Flask(__name__)
CORS(app)

# --- Global Variables ---
models = load_models()
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
cap = None
active_exercise = None
corrector = None
latest_data = {"reps": 0, "form": "N/A", "accuracy": 0}

EXERCISE_MAP = {
    "squats": ("logic.squat_logic", "SquatCorrector"),
    # Add other exercises here like:
    "pushups": ("logic.pushup_logic", "PushupCorrector"),
    "curls": ("logic.curls_logic", "CurlsCorrector"),
    "shoulderpress": ("logic.shoulderPress_logic", "ShoulderPressCorrector"),
}

@app.route('/start_exercise/<exercise_name>', methods=['POST'])
def start_exercise(exercise_name):
    global active_exercise, corrector, latest_data
    if exercise_name in EXERCISE_MAP:
        active_exercise = exercise_name.lower()
        try:
            # Reset data when a new exercise starts
            latest_data = {"reps": 0, "form": "N/A", "accuracy": 0}
            
            module_name, class_name = EXERCISE_MAP[active_exercise]
            ExerciseModule = importlib.import_module(module_name)
            CorrectorClass = getattr(ExerciseModule, class_name)
            corrector = CorrectorClass()
            
            print(f"Successfully started exercise: {active_exercise}")
            return jsonify({"status": f"{active_exercise} session started"}), 200
        except Exception as e:
            print(f"Error starting exercise: {e}")
            return jsonify({"status": "Error initializing exercise"}), 500
    return jsonify({"status": "Exercise not found"}), 404

def video_generator():
    global cap, latest_data
    cap = cv2.VideoCapture(0)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap and cap.isOpened():
            ret, frame = cap.read()
            if not ret: break

            image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image_rgb)
            
            if results.pose_landmarks and corrector:
                try:
                    reps, form, acc = corrector.analyze_form(results.pose_landmarks.landmark, models.get(active_exercise))
                    latest_data = {"reps": reps, "form": form, "accuracy": acc}
                except Exception as e:
                    # print(f"Analysis error: {e}")
                    pass
            
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    if cap: cap.release()

def data_generator():
    while True:
        yield f"data:{json.dumps(latest_data)}\n\n"
        time.sleep(0.1)

@app.route('/video')
def video():
    return Response(stream_with_context(video_generator()), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/data')
def data():
    return Response(data_generator(), mimetype='text/event-stream')

@app.route('/stop', methods=['POST'])
def stop():
    global cap
    if cap is not None: cap = None
    return jsonify({"status": "camera released"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True, debug=True, use_reloader=False)