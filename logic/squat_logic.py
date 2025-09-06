# logic/squat_logic.py
import mediapipe as mp
from .base_corrector import BaseCorrector
from .utils import calculate_angle

mp_pose = mp.solutions.pose

class SquatCorrector(BaseCorrector):
    """
    A class dedicated to analyzing squat form, counting reps,
    and providing feedback.
    """
    def __init__(self):
        """
        Initializes the SquatCorrector with squat-specific landmarks
        and initial state.
        """
        super().__init__()
        # Define the specific landmarks needed to analyze a squat
        self.landmarks_to_use = [
            mp_pose.PoseLandmark.LEFT_SHOULDER.value, mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
            mp_pose.PoseLandmark.LEFT_HIP.value, mp_pose.PoseLandmark.RIGHT_HIP.value,
            mp_pose.PoseLandmark.LEFT_KNEE.value, mp_pose.PoseLandmark.RIGHT_KNEE.value,
            mp_pose.PoseLandmark.LEFT_ANKLE.value, mp_pose.PoseLandmark.RIGHT_ANKLE.value
        ]

        self.column_names = []
        for idx in self.landmarks_to_use:
            name = mp_pose.PoseLandmark(idx).name
            self.column_names.extend([f'{name.lower()}_x', f'{name.lower()}_y', f'{name.lower()}_z', f'{name.lower()}_visibility'])

    def analyze_form(self, landmarks, model):
        """
        Analyzes the squat form using rule-based logic and returns
        reps, form feedback, and an accuracy score.
        
        Args:
            landmarks: A list of all 33 detected landmarks from MediaPipe.
            model: The loaded machine learning model for squats (for accuracy score).
        
        Returns:
            A tuple containing (rep_count, form_feedback, accuracy_score).
        """
        # --- 1. Extract Key Landmark Coordinates ---
        # Use the left side for calculations as a consistent reference
        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

        # --- 2. Calculate Angles for Rule-Based Logic ---
        knee_angle = calculate_angle(hip, knee, ankle)
        hip_angle = calculate_angle(shoulder, hip, knee)

        # --- 3. Apply Rules for Feedback and Rep Counting ---
        form_feedback = "Good Form"
        accuracy = 100

        # Determine squat phase (up or down)
        if hip_angle > 160 and knee_angle > 160:
            self.stage = "up"
        
        if self.stage == "up" and hip_angle < 150:
            self.stage = "down"
            
        # Provide feedback during the 'down' phase
        if self.stage == "down":
            if knee_angle < 90:
                form_feedback = "Good Depth"
            else:
                form_feedback = "Go Deeper"
                accuracy -= 25
            
            if hip_angle < 50:
                form_feedback = "Keep Chest Up"
                accuracy -= 25
        
        # Count reps on the way up
        if self.stage == "down" and knee_angle > 160:
            self.stage = "up"
            self.counter += 1
        
        # --- 4. (Optional) Use ML model for a more nuanced score ---
        # If you want to use the ML model for accuracy, you can uncomment this.
        # Otherwise, the rule-based accuracy will be used.
        #
        if model:
            try:
                row = []
                for idx in self.landmarks_to_use:
                    lm = landmarks[idx]
                    row.extend([lm.x, lm.y, lm.z, lm.visibility])
                
                import pandas as pd
                X = pd.DataFrame([row], columns=self.column_names)
                
                # prediction_class = model.predict(X)[0]
                prediction_proba = model.predict_proba(X)[0]
                
                # form_feedback = prediction_class.replace('_', ' ').title()
                accuracy = int(max(prediction_proba) * 100)
                
            except Exception as e:
                print(f"MODEL PREDICTION ERROR: {e}")
                form_feedback = "Error"
                accuracy = 0

        # row = [] # Create the feature row for the model
        # for idx in self.landmarks:
        #     lm = landmarks[idx]
        #     row.extend([lm.x, lm.y, lm.z, lm.visibility])
        
        # import pandas as pd
        # X = pd.DataFrame([row], columns = self.column_names) # Note: you'll need to pass column names
        # confidence = model.predict_proba(X)[0]
        # accuracy = int(confidence[0] * 100) # Assuming 'good_form' is the first class

        return self.counter, form_feedback, accuracy