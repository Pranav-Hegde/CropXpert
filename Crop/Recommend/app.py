from flask import Flask, render_template, request
import numpy as np
import pickle

app = Flask(__name__)

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
    N = float(request.form['nitrogen'])
    P = float(request.form['phosphorus'])
    K = float(request.form['potassium'])
    temp = float(request.form['temperature'])
    humidity = float(request.form['humidity'])
    ph = float(request.form['ph'])
    rainfall = float(request.form['rainfall'])

    feature_list = [N, P, K, temp, humidity, ph, rainfall]
    single_pred = np.array(feature_list).reshape(1, -1)

    mx_features = mx.transform(single_pred)
    sc_mx_features = sc.transform(mx_features)
    prediction = model.predict(sc_mx_features)[0]

    result = f"{crop_dict.get(prediction, 'Sorry, we could not determine the best crop.')} is the best crop to be cultivated here"

    return render_template('Result.html', result=result)
if __name__ == "__main__":
    app.run(port=5001, debug=True)
