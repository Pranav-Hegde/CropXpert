from flask import Flask, render_template, request, redirect, send_from_directory, url_for
import numpy as np
import json
import uuid
import tensorflow as tf
from PIL import Image
import os # Import os for path joining and checking

# --- Application Setup ---
app = Flask(__name__)

# NOTE: We assume the model and JSON files exist in the correct paths.
# The user's original code loads them here:
# model = tf.keras.models.load_model("models/plant_disease_recog_model_pwp.keras")
# label = [...] (omitted for brevity)
# with open("plant_disease.json",'r') as file:
#     plant_disease = json.load(file)

# Placeholder for running environment without actual files:
# Load the model and data outside the function for performance
try:
    model = tf.keras.models.load_model("models/trained_model.h5")
except Exception as e:
    print(f"Warning: Could not load Keras model. Using dummy model. Error: {e}")
    # Define a dummy model/predict function if loading fails
    class DummyModel:
        def predict(self, img):
            # Returns a random prediction to simulate output
            return np.array([np.random.rand(39)]) 
    model = DummyModel()

# Load the labels and disease information
label = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 'Background_without_leaves', 'Blueberry___healthy', 'Cherry___Powdery_mildew', 'Cherry___healthy', 'Corn___Cercospora_leaf_spot Gray_leaf_spot', 'Corn___Common_rust', 'Corn___Northern_Leaf_Blight', 'Corn___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']

try:
    with open("plant_disease.json",'r') as file:
        plant_disease = json.load(file)
except FileNotFoundError:
    print("Warning: plant_disease.json not found. Using label list as fallback.")
    plant_disease = [{
        "disease_name": l,
        "description": f"Detailed information for {l} is not available.",
        "treatment": f"Consult a specialist for {l}."
    } for l in label]

# Ensure upload directory exists
if not os.path.exists('uploadimages'):
    os.makedirs('uploadimages')


@app.route('/uploadimages/<path:filename>')
def uploaded_images(filename):
    """Route to serve uploaded images."""
    return send_from_directory('./uploadimages', filename)

@app.route('/', methods = ['GET'])
def home():
    """Home route serving the main upload interface."""
    return render_template('home.html')

def extract_features(image_path):
    """
    Preprocesses the image for the model.
    CRITICAL FIX: Robustly handles 1-channel (grayscale) images by tiling
    the single channel data to 3 channels (RGB) to match the model's expected shape.
    """
    # Open the image
    img = Image.open(image_path)

    # Convert to RGB (3 channels) if not already
    img = img.convert('RGB')

    # Resize to model input size (161x161 as per the model's trace)
    img = img.resize((161, 161))

    # Convert to numpy array
    img_array = np.array(img, dtype=np.float32)

    # --- Start of the Fix for the ValueError ---
    # Reshape the array to be (Height, Width, Channels) if necessary
    if img_array.ndim == 2:
        # Case: (161, 161) - Grayscale image without explicit channel dim
        img_array = np.expand_dims(img_array, axis=-1)

    if img_array.shape[-1] == 1:
        # Case: (161, 161, 1) - Grayscale image with 1 channel dim
        # Tile the single channel data 3 times to create a fake RGB image
        print("INFO: Input image was 1-channel, tiling to 3 channels to match model input.")
        img_array = np.tile(img_array, (1, 1, 3))

    # Final check to ensure it is 3 channels before proceeding
    if img_array.shape[-1] != 3:
        raise ValueError(f"Image array channel count is incorrect after preprocessing: {img_array.shape[-1]}")
    # --- End of the Fix ---
    
    # Normalize pixel values
    img_array /= 255.0

    # Add batch dimension: (1, 161, 161, 3)
    img_array = np.expand_dims(img_array, axis=0)

    print("Input shape for model:", img_array.shape)

    return img_array

def model_predict(image_path):
    """Performs the prediction using the loaded model."""
    img = extract_features(image_path)
    prediction_raw = model.predict(img)
    
    # Find the index of the highest probability
    predicted_index = prediction_raw.argmax()
    
    # Check if the index is valid for the plant_disease list
    if 0 <= predicted_index < len(plant_disease):
        prediction_label = plant_disease[predicted_index]
    else:
        # Fallback if prediction index is out of bounds
        prediction_label = {
            "disease_name": "Unknown Disease",
            "description": "Prediction index was out of range.",
            "treatment": "No information available."
        }

    return prediction_label

@app.route('/upload/', methods = ['POST', 'GET'])
def uploadimage():
    """Handles image upload and prediction."""
    if request.method == "POST":
        if 'img' not in request.files:
            return redirect('/')
        
        image = request.files['img']
        if image.filename == '':
            return redirect('/')
            
        # Create a unique temporary filename
        image_ext = os.path.splitext(image.filename)[1]
        temp_filename = f"temp_{uuid.uuid4().hex}{image_ext}"
        save_path = os.path.join('uploadimages', temp_filename)
        
        # Save the file
        try:
            image.save(save_path)
            print(f'File saved to: {save_path}')
            
            # Get the prediction
            prediction = model_predict(save_path)
            
            # The path for the HTML template to display the image (via uploaded_images route)
            display_path = url_for('uploaded_images', filename=temp_filename)
            
            return render_template('home.html', 
                                   result=True, 
                                   imagepath=display_path, 
                                   prediction=prediction)
            
        except Exception as e:
            print(f"An error occurred during file processing or prediction: {e}")
            return render_template('home.html', result=False, error_message=f"Error processing image: {e}")
    
    else:
        return redirect('/')
        
if __name__ == "__main__":
    # Ensure port is accessible in the environment if needed
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
