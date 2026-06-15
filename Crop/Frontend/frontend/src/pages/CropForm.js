import React, { useState } from "react";
import axios from "axios";

const CropForm = () => {
    const [formData, setFormData] = useState({
        Nitrogen: "", Phosporus: "", Potassium: "",
        Temperature: "", Humidity: "", pH: "", Rainfall: ""
    });
    const [result, setResult] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const recommendUrl = process.env.REACT_APP_RECOMMEND_API_URL || "http://localhost:5001";
            const res = await axios.post(`${recommendUrl}/predict`, formData);
            setResult(res.data.result);
        } catch (err) {
            console.error(err);
            setResult("❌ Prediction failed. Try again.");
        }
    };

    const inputConfig = {
        Nitrogen: { min: 0, max: 200, step: 1, placeholder: "e.g. 0 to 200" },
        Phosporus: { min: 0, max: 200, step: 1, placeholder: "e.g. 0 to 200" },
        Potassium: { min: 0, max: 300, step: 1, placeholder: "e.g. 0 to 300" },
        Temperature: { min: 0, max: 60, step: 0.1, placeholder: "e.g. 0 to 60 °C" },
        Humidity: { min: 0, max: 100, step: 0.1, placeholder: "e.g. 0 to 100 %" },
        pH: { min: 0, max: 14, step: 0.1, placeholder: "e.g. 0 to 14" },
        Rainfall: { min: 0, max: 1000, step: 0.1, placeholder: "e.g. 0 to 1000 mm" }
    };

    return (
        <div className="container mt-5">
            <h2>Crop Recommendation Form</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => {
                    const config = inputConfig[key] || { min: 0, max: 1000, step: "any", placeholder: "" };
                    return (
                        <div className="mb-3" key={key}>
                            <label className="form-label fw-bold">{key}</label>
                            <input
                                type="number"
                                name={key}
                                className="form-control"
                                value={formData[key]}
                                onChange={handleChange}
                                min={config.min}
                                max={config.max}
                                step={config.step}
                                placeholder={config.placeholder}
                                required
                            />
                        </div>
                    );
                })}
                <button type="submit" className="btn btn-success w-100">Get Recommendation</button>
            </form>

            {result && (
                <div className="mt-4 alert alert-info">
                    <strong>Recommended Crop: </strong> {result}
                </div>
            )}
        </div>
    );
};

export default CropForm;
