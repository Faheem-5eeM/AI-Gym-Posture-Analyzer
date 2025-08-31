import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

# ==============================================================================
# Step 1: Load Your Dataset
# ==============================================================================
# Make sure your CSV file is in the same directory as this script,
# or provide the full path to it.
CSV_PATH = 'squat_form_data.csv' 
df = pd.read_csv(CSV_PATH)

print("Dataset loaded successfully.")
print("First 5 rows of the dataset:")
print(df.head())
print(f"\nDataset contains {len(df)} rows.")

# ==============================================================================
# Step 2: Prepare the Data
# ==============================================================================
# 'X' contains our features (all the landmark coordinates)
# 'y' contains our labels (the 'class' column)
X = df.drop('class', axis=1) 
y = df['class']

print("\nFeatures (X) and labels (y) have been separated.")

# ==============================================================================
# Step 3: Split Data into Training and Testing Sets
# ==============================================================================
# We'll use 80% of the data to train the model and 20% to test its performance.
# random_state ensures that the split is the same every time you run the script.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Data split into training ({len(X_train)} rows) and testing ({len(X_test)} rows) sets.")

# ==============================================================================
# Step 4: Choose and Train the Model
# ==============================================================================
# We'll use a RandomForestClassifier, which is a powerful and reliable model for this kind of task.
model = RandomForestClassifier(n_estimators=100, random_state=42)

print("\nTraining the model...")
# The .fit() function is where the model learns from your training data.
model.fit(X_train, y_train)
print("Model training complete! ✅")

# ==============================================================================
# Step 5: Evaluate the Model
# ==============================================================================
# Now we use the trained model to make predictions on the test data it has never seen before.
y_pred = model.predict(X_test)

# We compare the model's predictions (y_pred) to the actual correct labels (y_test).
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy on Test Data: {accuracy * 100:.2f}%")

# ==============================================================================
# Step 6: Save the Trained Model
# ==============================================================================
# We save the trained model to a file using 'pickle'.
# This allows us to load and use it in our Flask app without retraining.
model_filename = 'squat_form_model.pkl'
with open(model_filename, 'wb') as f:
    pickle.dump(model, f)

print(f"\nModel saved successfully as '{model_filename}'! ✨")