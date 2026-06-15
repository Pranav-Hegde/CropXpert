# CROP RECOMMENDATION SYSTEM

**A PROJECT REPORT**

Submitted in partial fulfillment of the requirements for the award of the degree of

**MASTER OF COMPUTER APPLICATIONS**

By

**PRANAV RAMACHANDRA HEGDE**

Under the guidance of

**Dr. V. SRINIVASAN**

---

## DECLARATION

I, **Pranav Ramachandra Hegde**, student of **Dayananda Sagar College of Engineering**, hereby declare that the project work entitled "**Crop Recommendation System**" has been carried out by me under the supervision of **Dr. V. Srinivasan**. This project is submitted in partial fulfillment of the requirements for the award of the degree of Master of Computer Applications.

I further declare that this project has not been submitted to any other University or Institute for the award of any degree or diploma.

Place: Bangalore
Date: 

**(Pranav Ramachandra Hegde)**

---

## ACKNOWLEDGEMENT

I dedicate this page to those who are responsible for bringing a proper shape to this project. Without their guidance and help, this project would not have been so smooth and efficient.

I thank **Dayananda Sagar College of Engineering**, for providing me the opportunity to take up this project work for completion of my MCA degree. I also thank **Dr. B G Prasad**, Principal, DSCE Bangalore, for providing all the facilities and infrastructure. I extend my gratitude to our HOD, **Dr. Samitha Khaiyum**, Department of MCA-VTU, DSCE Bangalore, for having provided me the opportunity to materialize this project.

I am extremely grateful to **Dr. V. Srinivasan**, my internal guide, who has shown great support and interest in helping me design this project. His constant monitoring and encouragement helped me keep up to the project schedule and maintain a smooth flow. I also thank all the faculty members of the Dept of MCA for their guidance throughout my MCA course.

Finally, the ubiquitous thanks to my family and friends, for their moral support and encouraging words at times whenever the going got tough.

---

## ABSTRACT

The **Crop Recommendation System** is an innovative web-based application designed to assist farmers and agricultural enthusiasts in making informed decisions regarding crop cultivation. In an era where climate change and soil degradation pose significant challenges to agriculture, selecting the right crop is crucial for maximizing yield and sustainability.

This project utilizes advanced **Machine Learning** algorithms to analyze key environmental and soil parameters, including Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH value, and Rainfall. By processing these inputs, the system predicts the most suitable crop for a specific piece of land with high accuracy.

The application features a modern, responsive user interface built with **React.js**, ensuring accessibility across various devices. The backend is powered by a hybrid architecture using **Node.js** for user management and application logic, and **Python (Flask)** for serving the machine learning model. **MongoDB** is employed as the database to store user data and history.

In conclusion, the Crop Recommendation System aims to bridge the gap between traditional farming practices and modern technology, empowering users with data-driven insights to enhance agricultural productivity and economic efficiency.

---

## TABLE OF CONTENTS

| Sl. No | Contents | Page No |
| :--- | :--- | :--- |
| | DECLARATION | i |
| | ACKNOWLEDGEMENT | ii |
| | ABSTRACT | iii |
| | TABLE OF CONTENTS | iv |
| | LIST OF FIGURES | v |
| 1 | **INTRODUCTION** | 1 |
| 1.1 | Objectives | 1 |
| 1.2 | Scope | 2 |
| 2 | **LITERATURE SURVEY** | 4 |
| 2.1 | Outcome of literature survey | 5 |
| 2.2 | Existing system | 7 |
| 2.3 | Proposed system | 9 |
| 2.4 | Feasibility study | 10 |
| 2.5 | Tools and Technologies used | 12 |
| 2.6 | Hardware and Software Requirement | 15 |
| 3 | **FEATURES** | 16 |
| 3.1 | Features | 16 |
| 4 | **SOFTWARE REQUIREMENTS SPECIFICATION** | 20 |
| 4.1 | Introduction | 20 |
| 4.2 | Overall Description | 21 |
| 4.3 | External Interface Requirements | 22 |
| 4.4 | System Features | 23 |
| 4.5 | Other Nonfunctional Requirements | 24 |
| 5 | **SYSTEM DESIGN** | 25 |
| 5.1 | Introduction | 25 |
| 5.2 | Overall Description | 26 |
| 5.3 | External Interface Requirements | 28 |
| 5.4 | Other Nonfunctional Requirements | 28 |
| 6 | **DETAILED DESIGN DOCUMENT** | 30 |
| 6.1 | Architecture Diagram | 30 |
| 6.2 | Use case diagram | 33 |
| 7 | **IMPLEMENTATION** | 37 |
| 8 | **SOFTWARE TESTING** | 43 |
| 9 | **CONCLUSION** | 46 |
| 10 | **FUTURE ENHANCEMENT** | 47 |
| 11 | **BIBLIOGRAPHY** | 48 |

---

## LIST OF FIGURES

| Fig. No | Name | Page No |
| :--- | :--- | :--- |
| 1 | System Architecture | 30 |
| 2 | Use Case Diagram | 33 |
| 3 | Home Page | 37 |
| 4 | Crop Prediction Form | 38 |
| 5 | Prediction Result | 39 |

---

## 1. INTRODUCTION

### 1.1 Objectives
The primary objective of the **Crop Recommendation System** is to provide a scientific and data-driven approach to crop selection.
*   To analyze soil and weather parameters (N, P, K, Temperature, Humidity, pH, Rainfall).
*   To predict the most suitable crop using Machine Learning algorithms.
*   To provide a user-friendly interface for farmers to easily input data and view results.
*   To increase agricultural productivity by recommending optimal crops.

### 1.2 Scope
The scope of this project extends to:
*   **Farmers**: Who can use the tool to decide which crop to plant for the coming season.
*   **Agricultural Researchers**: Who can use the system to analyze crop suitability in different regions.
*   **Educational Institutions**: For demonstrating the application of AI in agriculture.
The system is designed to be accessible via a web browser, making it available on both computers and mobile devices.

---

## 2. LITERATURE SURVEY

### 2.1 Outcome of literature survey
A survey of existing agricultural systems reveals that while there are many tools for weather forecasting and market price prediction, there is a need for more accessible and accurate crop recommendation tools that consider multiple parameters simultaneously. Many existing systems are either too complex for the average farmer or lack the integration of modern machine learning techniques.

### 2.2 Existing system
Traditionally, farmers rely on experience, intuition, and general local guidelines to select crops.
*   **Drawbacks**:
    *   Lack of precision.
    *   Inability to adapt to rapidly changing climate conditions.
    *   Risk of yield loss due to unsuitable crop selection.

### 2.3 Proposed system
The proposed **Crop Recommendation System** automates the selection process using a trained Machine Learning model.
*   **Advantages**:
    *   **High Accuracy**: Uses historical data and complex patterns to make predictions.
    *   **Ease of Use**: Simple web interface.
    *   **Comprehensive Analysis**: Considers multiple factors (Soil nutrients, Weather) together.

### 2.4 Feasibility study
*   **Technical Feasibility**: The project uses standard web technologies (React, Node.js) and well-established ML libraries (Scikit-learn), making it technically feasible.
*   **Operational Feasibility**: The system is easy to operate and requires no special training for the end-user.
*   **Economic Feasibility**: Being open-source and web-based, the cost of deployment and usage is minimal.

### 2.5 Tools and Technologies used
*   **Frontend**: React.js, Bootstrap, HTML5, CSS3.
*   **Backend**: Node.js, Express.js.
*   **Machine Learning Service**: Python, Flask, Scikit-learn, Pandas, NumPy.
*   **Database**: MongoDB.
*   **IDE**: VS Code.

### 2.6 Hardware and Software Requirement
**Hardware**:
*   Processor: Intel Core i3 or higher.
*   RAM: 4GB or higher.
*   Hard Disk: 10GB free space.

**Software**:
*   Operating System: Windows 10/11 or Linux.
*   Node.js Runtime.
*   Python 3.x.
*   Web Browser (Chrome, Firefox, etc.).

---

## 3. FEATURES

### 3.1 Features
1.  **Crop Prediction**: The core feature where users input soil and weather data to get a crop recommendation.
2.  **Interactive Forms**: Easy-to-use input fields with validation.
3.  **Result Visualization**: Clear display of the recommended crop.
4.  **Responsive Design**: Works well on mobile and desktop screens.
5.  **Secure Architecture**: Separation of concerns between frontend, backend, and ML service.

---

## 4. SOFTWARE REQUIREMENTS SPECIFICATION

### 4.1 Introduction
This section describes the software requirements for the Crop Recommendation System, including functional and non-functional requirements.

### 4.2 Overall Description
The system operates as a web application. Users interact with the Frontend, which sends data to the Backend. The Backend communicates with the ML Service to get predictions and returns the result to the user.

### 4.3 External Interface Requirements
*   **User Interface**: Web-based GUI.
*   **Hardware Interface**: Standard PC/Mobile hardware.
*   **Software Interface**: APIs for communication between Node.js and Flask.

### 4.4 System Features
*   **Input Processing**: Validates user inputs for N, P, K, etc.
*   **Prediction Engine**: Uses the Random Forest (or similar) model to predict the crop.
*   **Data Display**: Shows the prediction result instantly.

### 4.5 Other Nonfunctional Requirements
*   **Performance**: The system should respond within 2 seconds.
*   **Reliability**: The system should be available 99% of the time.
*   **Security**: Inputs should be sanitized to prevent injection attacks.

---

## 5. SYSTEM DESIGN

### 5.1 Introduction
System design defines the architecture, components, modules, interfaces, and data for the system to satisfy specified requirements.

### 5.2 Overall Description
The system follows a **Microservices-like architecture**:
*   **Client**: React App.
*   **API Gateway / Backend**: Node.js/Express.
*   **ML Service**: Python/Flask.

### 5.3 External Interface Requirements
RESTful APIs are used for communication. JSON is the standard data format.

---

## 6. DETAILED DESIGN DOCUMENT

### 6.1 Architecture Diagram
*(Placeholder for Diagram)*
[React Frontend] <--> [Node.js Backend] <--> [Python Flask ML Service]
                                      |
                                  [MongoDB]

### 6.2 Use case diagram
*   **Actors**: User (Farmer/Admin).
*   **Use Cases**:
    *   Enter Soil Details.
    *   Enter Weather Details.
    *   View Recommendation.
    *   Login/Register (if applicable).

---

## 7. IMPLEMENTATION

The implementation is divided into three main modules:

1.  **Machine Learning Module (Python)**:
    *   Data Preprocessing using Pandas.
    *   Model Training using Scikit-learn (Random Forest Classifier).
    *   Model Serialization using Pickle (`model.pkl`).
    *   Flask API (`app.py`) to expose the model.

2.  **Backend Module (Node.js)**:
    *   Express server setup (`server.js`).
    *   API routes for handling client requests.
    *   Database connection to MongoDB.

3.  **Frontend Module (React)**:
    *   Component-based architecture.
    *   State management for form inputs.
    *   Axios for making HTTP requests to the backend.
    *   Bootstrap for styling.

---

## 8. SOFTWARE TESTING

### Test Cases

| Test Case ID | Description | Input Data | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC01 | Verify Input Validation | N = -10 | Error Message | Error Message | Pass |
| TC02 | Verify Prediction | Valid Inputs (N=90, P=42, etc.) | "Rice" (or valid crop) | "Rice" | Pass |
| TC03 | Verify API Connection | Ping /predict | 200 OK | 200 OK | Pass |
| TC04 | Verify UI Responsiveness | Resize Window | Layout adjusts | Layout adjusts | Pass |

---

## 9. CONCLUSION

The **Crop Recommendation System** successfully demonstrates the application of Machine Learning in agriculture. By providing accurate crop recommendations based on scientific data, it empowers farmers to make better decisions, potentially increasing yields and profitability. The project highlights the synergy between modern web technologies and data science.

---

## 10. FUTURE ENHANCEMENT

*   **Real-time Weather Integration**: Automatically fetch weather data based on location.
*   **Fertilizer Recommendation**: Add a feature to recommend fertilizers based on soil deficiency.
*   **Multi-language Support**: Support local languages for better accessibility to farmers.
*   **Mobile App**: Develop a native mobile application.

---

## 11. BIBLIOGRAPHY

1.  Documentation of React.js - https://reactjs.org/
2.  Documentation of Scikit-learn - https://scikit-learn.org/
3.  Flask Documentation - https://flask.palletsprojects.com/
4.  Research papers on Crop Prediction using Machine Learning.
