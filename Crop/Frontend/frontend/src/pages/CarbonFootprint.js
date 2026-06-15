import React, { useState } from "react";
import axios from "axios";
import "./CSS/CarbonFootprint.css";

const CarbonFootprint = () => {
    const [formData, setFormData] = useState({
        area: "",
        n_fert: "",
        p_fert: "",
        k_fert: "",
        diesel: "",
        electricity: ""
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResult(null);

        try {
            const carbonUrl = process.env.REACT_APP_CARBON_API_URL || "http://localhost:5002";
            const res = await axios.post(`${carbonUrl}/calculate`, formData);
            if (res.data.result) {
                setResult(res.data.result);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to calculate. Please check backend connection.");
        }
    };

    return (
        <div className="carbon-page">
            <div className="container">
                <h2 className="page-title">Carbon Footprint Calculator</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="glass-card">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Farm Area (Hectares)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="area"
                                        className="custom-input"
                                        placeholder="e.g. 5 (Max: 10,000)"
                                        value={formData.area}
                                        onChange={handleChange}
                                        min="0.01"
                                        max="10000"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nitrogen (N) Fertilizer (kg)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="n_fert"
                                        className="custom-input"
                                        placeholder="e.g. 50 (Max: 100,000)"
                                        value={formData.n_fert}
                                        onChange={handleChange}
                                        min="0"
                                        max="100000"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phosphorus (P) Fertilizer (kg)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="p_fert"
                                        className="custom-input"
                                        placeholder="e.g. 20 (Max: 100,000)"
                                        value={formData.p_fert}
                                        onChange={handleChange}
                                        min="0"
                                        max="100000"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Potassium (K) Fertilizer (kg)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="k_fert"
                                        className="custom-input"
                                        placeholder="e.g. 20 (Max: 100,000)"
                                        value={formData.k_fert}
                                        onChange={handleChange}
                                        min="0"
                                        max="100000"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Diesel Fuel (Liters)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="diesel"
                                        className="custom-input"
                                        placeholder="e.g. 100 (Max: 100,000)"
                                        value={formData.diesel}
                                        onChange={handleChange}
                                        min="0"
                                        max="100000"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Electricity (kWh)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="electricity"
                                        className="custom-input"
                                        placeholder="e.g. 500 (Max: 1,000,000)"
                                        value={formData.electricity}
                                        onChange={handleChange}
                                        min="0"
                                        max="1000000"
                                    />
                                </div>
                                <button type="submit" className="calculate-btn">Calculate Footprint</button>
                            </form>

                            {error && <div className="alert-danger-custom">{error}</div>}
                        </div>
                    </div>

                    {result && (
                        <div className="col-lg-5 col-md-8">
                            <div className="glass-card result-container">
                                <div className="result-card-header">
                                    <h3 className="breakdown-title" style={{ textAlign: "center", marginBottom: 0 }}>Total Emissions</h3>
                                    <div className="emission-value">
                                        {result.total}<span className="emission-unit">kg CO2e</span>
                                    </div>
                                    <div className="emission-per-ha">
                                        <strong>{result.per_ha}</strong> kg CO2e / hectare
                                    </div>
                                </div>

                                <div className="result-body">
                                    <h4 className="breakdown-title">Emission Breakdown</h4>
                                    <div className="breakdown-list">
                                        {Object.entries(result.details).map(([key, value]) => (
                                            <div className="breakdown-item" key={key}>
                                                <span>{key}</span>
                                                <span className="breakdown-value">{value} kg</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarbonFootprint;
