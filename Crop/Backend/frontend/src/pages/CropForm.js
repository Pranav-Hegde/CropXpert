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
            const res = await axios.post("http://localhost:5001/predict", formData);
            setResult(res.data.result);
        } catch (err) {
            console.error(err);
            setResult("❌ Prediction failed. Try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crop Recommendation Form</h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div className="mb-3" key={key}>
                        <label>{key}</label>
                        <input
                            type="number"
                            name={key}
                            className="form-control"
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
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
