from flask import Flask, Response, stream_with_context, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import pandas as pd
import numpy as np
import pickle
import json 
import time

app = Flask(__name__)
CORS(app)

model_path = 'squat_form_model.pkl'
with open(model_path, 'rb') as f:
    model = pickle.load(f)


mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

cap = None   # global camera reference

latest_data = {
    "reps":0,
    "form": "N/A",
    "accuracy":0
}
counter = 0
stage = None
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    return angle if angle <= 180 else 360 - angle


def generate():
    global cap,latest_data,counter,stage
    cap = cv2.VideoCapture(0)
    # cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)   # Width
    # cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)   # Height


    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # process
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                landmarks = results.pose_landmarks.landmark

                row = np.array([[lm.x, lm.y, lm.z, lm.visibility] for lm in landmarks]).flatten().tolist()
                
                X = pd.DataFrame([row]) # Create a DataFrame for the model
                prediction_class = model.predict(X)[0]
                prediction_proba = model.predict_proba(X)[0]

                confidence = round(prediction_proba[np.argmax(prediction_proba)], 2)

                feedback = prediction_class.replace('_', ' ').title()
                # feedback_color = (0, 255, 0) if prediction_class == 'good_form' else (0, 0, 255) # Green for good, Red for bad

                # cv2.putText(image, 'FORM:', (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)
                # cv2.putText(image, feedback, (80, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, feedback_color, 2, cv2.LINE_AA)
                
                # cv2.putText(image, 'ACCURACY:', (10, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)
                # cv2.putText(image, str(int(confidence * 100)) + '%', (140, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.7, feedback_color, 2, cv2.LINE_AA)

                hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                       landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                         landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                angle = calculate_angle(hip, knee, ankle)

                if angle < 90:
                    stage = "down"
                if angle > 160 and stage == 'down':
                    stage = "up"
                    counter += 1

                # cv2.putText(image, f'REPS: {counter}', (10,50),
                #             cv2.FONT_HERSHEY_SIMPLEX, 1, (255,0,0), 2, cv2.LINE_AA)
                # cv2.putText(image, f'Angle: {int(angle)}', (10,100),
                #             cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
                
                latest_data = {
                    "reps": counter,
                    "form": feedback,
                    "accuracy": int(confidence * 100)
                }
                
            except:
                pass

            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # encode and stream
            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

def data_generator():
    while True:
        # Yield the latest data as a JSON string
        json_data = json.dumps(latest_data)
        yield f"data:{json_data}\n\n"
        time.sleep(0.1) # Send data 10 times per second

@app.route('/video')
def video():
    return Response(stream_with_context(generate()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/data')
def data():
    return Response(data_generator(), mimetype='text/event-stream')

@app.route('/stop', methods=['POST'])
def stop():
    global cap
    if cap is not None and cap.isOpened():
        cap.release()
        cap = None
        return jsonify({"status": "camera released"}), 200
    return jsonify({"status": "no camera active"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
