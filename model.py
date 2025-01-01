import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from ucimlrepo import fetch_ucirepo 
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# load dataset 
sepsis_survival_minimal_clinical_records: pd.DataFrame = fetch_ucirepo(id=827) 

# Calculate the percentage of patients who died
total_patients = len(sepsis_survival_minimal_clinical_records.data.original)
patients_died = sepsis_survival_minimal_clinical_records.data.original['hospital_outcome_1alive_0dead'].value_counts()[0]
percentage_died = (patients_died / total_patients) * 100

print(f'Percentage of patients who died: {percentage_died:.2f}%')

stats = {
    'age' : {
        'mean' : sepsis_survival_minimal_clinical_records.data.original['age_years'].mean(),
        'median' : sepsis_survival_minimal_clinical_records.data.original['age_years'].median(),
        'std' : sepsis_survival_minimal_clinical_records.data.original['age_years'].std(),
        'min' : sepsis_survival_minimal_clinical_records.data.original['age_years'].min(),
        'max' : sepsis_survival_minimal_clinical_records.data.original['age_years'].max(),
    }
}

# Select features and target
X = sepsis_survival_minimal_clinical_records.data.original[['age_years', 'sex_0male_1female', 'episode_number']]
y = sepsis_survival_minimal_clinical_records.data.original['hospital_outcome_1alive_0dead']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)

# Initialize and train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, zero_division=0)

print(f'Accuracy: {accuracy}')
print('Classification Report:')
print(report)

#Convert the model to ONNX format
initial_type = [("float_inputs", FloatTensorType([None, 3]))]
onx = convert_sklearn(model, initial_types=initial_type, target_opset=12, options = {type(model): {'zipmap': False}})
with open("logreg_sepsis.onnx", "wb") as f:
    f.write(onx.SerializeToString())

