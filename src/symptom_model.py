import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import os

# This function would be used to train the model with real medical data
def train_symptom_model():
    """
    Train a model on a medical dataset.
    
    In a real implementation, you would:
    1. Load real medical data
    2. Preprocess the data
    3. Train a model
    4. Save the model
    """
    # In a real implementation, you would load actual medical data here
    # For now, we'll create some synthetic data for illustration
    
    # Example features: Each column represents a symptom
    symptoms = [
        'fever', 'cough', 'headache', 'fatigue', 'chest_pain',
        'shortness_of_breath', 'sore_throat', 'runny_nose', 'muscle_pain',
        'joint_pain', 'nausea', 'vomiting', 'diarrhea', 'constipation',
        'abdominal_pain', 'back_pain', 'dizziness', 'sweating', 'loss_of_appetite',
        'weight_loss', 'skin_rash', 'itching', 'swelling', 'blurred_vision',
        'eye_pain', 'ear_pain', 'hearing_loss', 'numbness', 'tingling',
        'weakness', 'confusion', 'memory_problems', 'anxiety', 'depression'
    ]
    
    # Example medical conditions
    conditions = [
        'Common Cold', 'Flu', 'COVID-19', 'Bronchitis', 'Pneumonia',
        'Tension Headache', 'Migraine', 'Sinus Infection', 'Anemia',
        'Sleep Apnea', 'Chronic Fatigue Syndrome', 'Angina', 'Heart Attack',
        'Acid Reflux', 'Asthma', 'Anxiety Disorder', 'Depression',
        'Pharyngitis', 'Tonsillitis', 'Strep Throat', 'Allergies',
        'Sinusitis', 'Fibromyalgia', 'Osteoarthritis', 'Rheumatoid Arthritis',
        'Gout', 'Lupus', 'Food Poisoning', 'Gastroenteritis', 'Appendicitis'
    ]
    
    # Generate synthetic dataset (5000 samples)
    np.random.seed(42)
    n_samples = 5000
    
    # Create synthetic feature matrix
    X = np.random.randint(0, 2, size=(n_samples, len(symptoms)))
    
    # Create synthetic labels with some medical knowledge
    y = []
    for i in range(n_samples):
        if X[i, symptoms.index('fever')] == 1 and X[i, symptoms.index('cough')] == 1:
            if X[i, symptoms.index('shortness_of_breath')] == 1:
                condition = 'COVID-19' if np.random.random() < 0.7 else 'Pneumonia'
            else:
                condition = 'Flu' if np.random.random() < 0.6 else 'Common Cold'
        elif X[i, symptoms.index('headache')] == 1:
            if X[i, symptoms.index('nausea')] == 1:
                condition = 'Migraine'
            else:
                condition = 'Tension Headache'
        elif X[i, symptoms.index('abdominal_pain')] == 1:
            if X[i, symptoms.index('nausea')] == 1 and X[i, symptoms.index('vomiting')] == 1:
                condition = 'Appendicitis' if np.random.random() < 0.3 else 'Gastroenteritis'
            else:
                condition = 'Food Poisoning'
        else:
            # Random condition for other combinations
            condition = np.random.choice(conditions)
        
        y.append(condition)
    
    # Convert to DataFrame
    df = pd.DataFrame(X, columns=symptoms)
    df['condition'] = y
    
    # Split features and target
    X = df.drop('condition', axis=1)
    y = df['condition']
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a Random Forest classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy:.4f}")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    with open('models/symptom_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    # Save symptom names and conditions for reference
    with open('models/symptoms.pkl', 'wb') as f:
        pickle.dump(symptoms, f)
    
    with open('models/conditions.pkl', 'wb') as f:
        pickle.dump(conditions, f)
    
    return model, symptoms, conditions

# Function to make predictions
def predict_condition(symptoms_list, pain_level=0):
    """
    Make a prediction based on symptoms.
    
    Args:
        symptoms_list: List of symptom names
        pain_level: Pain level (0-10)
    
    Returns:
        List of dictionaries with conditions and probabilities
    """
    try:
        # Load the model
        with open('models/symptom_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        # Load symptoms list
        with open('models/symptoms.pkl', 'rb') as f:
            all_symptoms = pickle.load(f)
        
        # Create input features (symptoms present or not)
        input_features = np.zeros(len(all_symptoms))
        
        for symptom in symptoms_list:
            # Convert to lowercase and replace spaces with underscores
            symptom = symptom.lower().replace(' ', '_')
            if symptom in all_symptoms:
                input_features[all_symptoms.index(symptom)] = 1
        
        # Get prediction probabilities
        input_features = input_features.reshape(1, -1)
        probabilities = model.predict_proba(input_features)[0]
        
        # Get the classes (conditions)
        classes = model.classes_
        
        # Create predictions list
        predictions = []
        for i, prob in enumerate(probabilities):
            # Adjust probability based on pain level for certain conditions
            adjusted_prob = prob
            condition = classes[i]
            
            if pain_level > 7 and condition in ['Heart Attack', 'Appendicitis', 'Migraine']:
                adjusted_prob = min(adjusted_prob * 1.5, 1.0)
            
            if adjusted_prob > 0.01:  # Only include non-negligible probabilities
                predictions.append({
                    'condition': condition,
                    'probability': round(adjusted_prob * 100, 1)
                })
        
        # Sort by probability
        predictions.sort(key=lambda x: x['probability'], reverse=True)
        
        # Return top predictions
        return predictions[:5]
    
    except Exception as e:
        print(f"Error making prediction: {e}")
        return []

# If this file is run directly, train the model
if __name__ == "__main__":
    print("Training symptom prediction model...")
    train_symptom_model()
    print("Model training complete.")