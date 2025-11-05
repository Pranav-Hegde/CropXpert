import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
    const [cred, setCred] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post("http://localhost:5000/api/auth/signup", cred);
            navigate("/login");
        } catch (err) {
            setError("❌ Email already exists");
        }
    };

    const handleChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value });
    };

    // 🌿 Darker Green Theme Styles
    const styles = {
        container: {
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        backgroundImage: {
            position: "absolute",
            inset: 0,
            backgroundImage: `url("/images/Login.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "transform 8s ease-in-out, filter 2s ease-in-out, opacity 2s ease-in-out",
            transform: isHovering ? "scale(1.05)" : "scale(1)", // soft zoom on hover
            opacity: 1, // fully visible
            filter: isHovering
                ? "brightness(1.2) contrast(1.15)"
                : "brightness(1.1) contrast(1.1)", // ✨ sharp, clear, bright
            animation: "fadeMove 20s ease-in-out infinite alternate", // smooth, slow motion
        },

        overlay: {
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.25)", // just a light shadow layer
            backdropFilter: "blur(2px)", // minimal blur for subtle glass effect
            zIndex: 1,
        },

        card: {
            width: "100%",
            maxWidth: "440px",
            background: "rgba(30, 41, 59, 0.9)",
            borderRadius: "24px",
            padding: "48px 40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            position: "relative",
            zIndex: 10,
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(49, 137, 72, 0.3)",
        },
        header: {
            textAlign: "center",
            marginBottom: "36px",
            fontSize: "28px",
            color: "#FFFFFF", // 🌟 Pure white title text
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            fontWeight: 700,
        },
        input: {
            width: "100%",
            padding: "14px 16px",
            fontSize: "15px",
            border: "2px solid #384C3F",
            borderRadius: "12px",
            backgroundColor: "#263238",
            color: "#FFFFFF",
            outline: "none",
            transition: "all 0.3s ease",
        },
        inputFocus: {
            borderColor: "#8BC34A",
            boxShadow: "0 0 0 4px rgba(139, 195, 74, 0.2)",
        },
        label: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: "4px",
        },
        error: {
            padding: "14px 16px",
            backgroundColor: "rgba(255, 0, 0, 0.15)",
            border: "2px solid #FFCDD2",
            borderRadius: "12px",
            color: "#FFEBEE",
            fontSize: "14px",
        },
        button: {
            width: "100%",
            padding: "16px",
            fontSize: "16px",
            fontWeight: 600,
            color: "#1a3a0f",
            background: "linear-gradient(135deg, #4ade80 0%, #C8E6C9 100%)",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 16px rgba(165, 214, 167, 0.4)",
        },
        buttonHover: {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 24px rgba(165, 214, 167, 0.6)",
        },
        footer: {
            marginTop: "28px",
            textAlign: "center",
            fontSize: "14px",
            color: "#4ade80",
        },
        link: {
            color: "#46f64cff",
            fontWeight: 600,
            textDecoration: "none",
        },
    };

    const getCombinedInputStyle = (name) => ({
        ...styles.input,
        ...(focusedInput === name ? styles.inputFocus : {}),
    });

    const getCombinedButtonStyle = () => ({
        ...styles.button,
        ...(isHovering ? styles.buttonHover : {}),
    });

    return (
        <div style={styles.container}>
            {/* 🌄 Background Image Layer */}
            <div style={styles.backgroundImage}></div>
            <div style={styles.overlay}></div>

            <div style={styles.card}>
                <h3 style={styles.header}>🌱 Create Your CropExpert Account</h3>

                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name" style={styles.label}>Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={cred.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput("name")}
                            onBlur={() => setFocusedInput(null)}
                            required
                            style={getCombinedInputStyle("name")}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={cred.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput(null)}
                            required
                            style={getCombinedInputStyle("email")}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={cred.password}
                            onChange={handleChange}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput(null)}
                            required
                            style={getCombinedInputStyle("password")}
                        />
                    </div>

                    <br />
                    <button
                        type="submit"
                        style={getCombinedButtonStyle()}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        ✅ Register
                    </button>

                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.footer}>
                        <small>
                            Already a member?{" "}
                            <Link
                                to="/login"
                                style={styles.link}
                            >
                                Login here
                            </Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
