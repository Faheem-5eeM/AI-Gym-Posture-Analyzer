# logic/pushup_logic.py
import mediapipe as mp
import pandas as pd
from .base_corrector import BaseCorrector
from .utils import calculate_angle

mp_pose = mp.solutions.pose

class PushupCorrector(BaseCorrector):
    """
    A class dedicated to analyzing push-up form, counting reps,
    and providing feedback using a machine learning model.
    """
    def __init__(self):
        """
        Initializes the PushupCorrector with push-up-specific landmarks
        and initial state.
        """
        super().__init__()
        
        # Define the specific landmarks needed for the push-up model
        # FIX: The variable is now named self.landmarks_to_use
        self.landmarks_to_use = [
            mp_pose.PoseLandmark.LEFT_SHOULDER.value, mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
            mp_pose.PoseLandmark.LEFT_ELBOW.value, mp_pose.PoseLandmark.RIGHT_ELBOW.value,
            mp_pose.PoseLandmark.LEFT_WRIST.value, mp_pose.PoseLandmark.RIGHT_WRIST.value,
            mp_pose.PoseLandmark.LEFT_HIP.value, mp_pose.PoseLandmark.RIGHT_HIP.value,
            mp_pose.PoseLandmark.LEFT_ANKLE.value, mp_pose.PoseLandmark.RIGHT_ANKLE.value
        ]
        
        # Dynamically generate the column names for the model
        self.column_names = []
        # FIX: The loop now uses the correct variable name
        for idx in self.landmarks_to_use:
            name = mp_pose.PoseLandmark(idx).name
            self.column_names.extend([f'{name.lower()}_x', f'{name.lower()}_y', f'{name.lower()}_z', f'{name.lower()}_visibility'])

    # In logic/pushup_logic.py

    def analyze_form(self, landmarks, model):
        """
        Analyzes push-up form using an ML model for feedback and angles for rep counting.
        """
        # --- 1. Rep Counting Logic (using angles) ---
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        elbow_angle = calculate_angle(shoulder, elbow, wrist)

        if elbow_angle > 160:
            self.stage = "up"
        if self.stage == 'up' and elbow_angle < 90:
            self.stage = "down"
            self.counter += 1
        
        # --- 2. Machine Learning Model for Form Feedback and Accuracy ---
        # FIX: This part is now separate and will run on every frame
        form_feedback = "N/A"
        accuracy = 0
        
        if model:
            try:
                row = []
                for idx in self.landmarks_to_use:
                    lm = landmarks[idx]
                    row.extend([lm.x, lm.y, lm.z, lm.visibility])
                
                import pandas as pd
                X = pd.DataFrame([row], columns=self.column_names)
                
                prediction_class = model.predict(X)[0]
                prediction_proba = model.predict_proba(X)[0]
                
                form_feedback = prediction_class.replace('_', ' ').title()
                accuracy = int(max(prediction_proba) * 100)
                
            except Exception as e:
                print(f"MODEL PREDICTION ERROR: {e}")
                form_feedback = "Error"
                accuracy = 0
        
        return self.counter, form_feedback, accuracy