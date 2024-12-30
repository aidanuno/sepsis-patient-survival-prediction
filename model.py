import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# load dataset 
breast_cancer_coimbra_data = pd.read_csv('dataR2.csv')

print(breast_cancer_coimbra_data['Age'][0])
  
# # metadata 
# print(breast_cancer_coimbra.metadata) 
# # variable information 
# print(breast_cancer_coimbra.variables) 

# Select features and target
X = breast_cancer_coimbra_data[['Resistin', 'Glucose', 'Age', 'BMI']]
y = breast_cancer_coimbra_data['Classification']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f'Accuracy: {accuracy}')
print('Classification Report:')
print(report)