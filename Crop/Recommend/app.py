from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests (e.g. from React frontend)

# Load models
model = pickle.load(open('model.pkl','rb'))
sc = pickle.load(open('standscaler.pkl','rb'))
mx = pickle.load(open('minmaxscaler.pkl','rb'))

crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya",
    7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes",
    12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil", 16: "Blackgram",
    17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
    21: "Chickpea", 22: "Coffee"
}

@app.route('/')
def index():
    return render_template("index.html")  # Optional homepage

@app.route('/CropForm.html')
def crop_form():
    return render_template("CropForm.html")  # Serve HTML form

@app.route("/predict", methods=['POST'])
def predict():
    # Detect if content is JSON or Form URL-encoded
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form or request.get_json(silent=True) or {}

    try:
        # React uses CamelCase (e.g. Nitrogen, Phosporus, pH). HTML form uses lowercase (e.g. nitrogen).
        N = float(data.get('Nitrogen') or data.get('nitrogen') or 0)
        P = float(data.get('Phosporus') or data.get('Phosphorus') or data.get('phosphorus') or 0)
        K = float(data.get('Potassium') or data.get('potassium') or 0)
        temp = float(data.get('Temperature') or data.get('temperature') or 0)
        humidity = float(data.get('Humidity') or data.get('humidity') or 0)
        ph = float(data.get('pH') or data.get('ph') or 0)
        rainfall = float(data.get('Rainfall') or data.get('rainfall') or 0)
    except (TypeError, ValueError) as e:
        error_msg = f"Invalid input values: {str(e)}"
        if request.is_json or request.headers.get('Accept') == 'application/json':
            return jsonify({'error': error_msg}), 400
        return error_msg, 400

    feature_list = [N, P, K, temp, humidity, ph, rainfall]
    single_pred = np.array(feature_list).reshape(1, -1)

    mx_features = mx.transform(single_pred)
    sc_mx_features = sc.transform(mx_features)
    prediction = model.predict(sc_mx_features)[0]

    result = f"{crop_dict.get(prediction, 'Sorry, we could not determine the best crop.')} is the best crop to be cultivated here"

    # Return JSON for React frontend API calls, HTML for legacy form posts
    if request.is_json or request.headers.get('Accept') == 'application/json':
        return jsonify({'result': result})

    return render_template('Result.html', result=result)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
