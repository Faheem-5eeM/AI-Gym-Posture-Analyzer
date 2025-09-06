# model_loader.py
import pickle

def load_models():
    models = {}
    try:
        with open('./models/squats_form_model.pkl', 'rb') as f:
            models['squats'] = pickle.load(f)
        with open('./models/pushups_form_model.pkl', 'rb') as f:
            models['pushups'] = pickle.load(f)
        with open('./models/curls_form_model.pkl', 'rb') as f:
            models['curls'] = pickle.load(f)
        with open('./models/shoulderPress_form_model.pkl', 'rb') as f:
            models['shoulderpress'] = pickle.load(f)
        # Add other models here...
        print("All models loaded successfully.")
    except Exception as e:
        print(f"Error loading models: {e}")
    return models