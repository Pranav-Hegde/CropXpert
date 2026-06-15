from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Carbon Emission Factors (approximate values in kg CO2e per unit)
FACTORS = {
    'N': 5.9,       # per kg
    'P': 0.9,       # per kg
    'K': 0.5,       # per kg
    'Diesel': 2.7,  # per liter
    'Electricity': 0.85 # per kWh (India avg)
}

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Get inputs
        area = float(data.get('area', 0)) # in hectares
        n_fert = float(data.get('n_fert', 0))
        p_fert = float(data.get('p_fert', 0))
        k_fert = float(data.get('k_fert', 0))
        diesel = float(data.get('diesel', 0))
        electricity = float(data.get('electricity', 0))

        # Calculate emissions
        emission_n = n_fert * FACTORS['N']
        emission_p = p_fert * FACTORS['P']
        emission_k = k_fert * FACTORS['K']
        emission_diesel = diesel * FACTORS['Diesel']
        emission_elec = electricity * FACTORS['Electricity']

        total_emission = emission_n + emission_p + emission_k + emission_diesel + emission_elec
        emission_per_ha = total_emission / area if area > 0 else 0

        result = {
            'total': round(total_emission, 2),
            'per_ha': round(emission_per_ha, 2),
            'details': {
                'Nitrogen Fertilizer': round(emission_n, 2),
                'Phosphorus Fertilizer': round(emission_p, 2),
                'Potassium Fertilizer': round(emission_k, 2),
                'Diesel Fuel': round(emission_diesel, 2),
                'Electricity': round(emission_elec, 2)
            }
        }
        
        return jsonify({'message': 'Success', 'result': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(port=5002, debug=True)
