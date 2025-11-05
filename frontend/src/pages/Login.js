"use client"

import React, { useState } from "react"
import axios from "axios"
// 💡 UPDATED IMPORTS: Use React Router's useNavigate and Link
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const LoginForm = () => {
    // 💡 Use useNavigate() instead of useRouter()
    const navigate = useNavigate()

    // State Initialization
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [focusedInput, setFocusedInput] = useState(null)
    const [isHovering, setIsHovering] = useState(false)

    // Event handler for form submission
    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password })

            if (res.status === 200) {
                // 💡 Use navigate() to redirect
                navigate("/dashboard")
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "❌ Invalid email or password. Please try again."
            setError(errorMessage)
        }
    }

    // 🎨 DARKER GREEN THEME STYLES (Retained for visual consistency)
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
            backgroundImage: `url("/images/Login.jpg")`,
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
        },
        logoContainer: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
            borderRadius: "20px",
            marginBottom: "20px",
            boxShadow: "0 8px 30px rgba(76, 175, 80, 0.4)",
        },
        logo: {
            fontSize: "40px",
        },
        title: {
            fontSize: "32px",
            fontWeight: 700,
            color: "#E8F5E9",
            marginBottom: "8px",
            marginTop: 0,
        },
        subtitle: {
            fontSize: "15px",
            color: "#4ade80",
            margin: 0,
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "24px",
        },
        input: {
            width: "100%",
            padding: "14px 16px",
            fontSize: "15px",
            border: "2px solid #384C3F",
            borderRadius: "12px",
            backgroundColor: "#263238",
            color: "#E8F5E9",
            outline: "none",
            transition: "all 0.3s ease",
        },
        inputFocus: {
            borderColor: "#8BC34A",
            boxShadow: "0 0 0 4px rgba(139, 195, 74, 0.2)",
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
            background: "linear-gradient(135deg, #4ade80 0%, #4ade80 100%)",
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
            color: "#4eff8fff",
            fontWeight: 600,
            textDecoration: "none",
        },
        tagline: {
            textAlign: "center",
            fontSize: "13px",
            color: "#032e13ff",
            marginTop: "24px",
            position: "relative",
            zIndex: 10,
        },
        label: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#FFFFFF", // pure white for better visibility
            marginBottom: "4px",
        },
        backgroundImage: {
            position: "absolute",
            inset: 0,
            backgroundImage: `url("/images/Register.png")`, // ✅
            backgroundSize: isHovering ? "110%" : "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "all 0.8s ease-in-out",
            filter: isHovering ? "brightness(0.4)" : "brightness(0.6)",
        },

    }
    // Utility functions (Simplified for pure JS)
    const getCombinedInputStyle = (isFocused, baseStyle, focusStyle) => ({
        ...baseStyle,
        ...(isFocused ? focusStyle : {}),
    });

    const getCombinedButtonStyle = (isHovered, baseStyle, hoverStyle) => ({
        ...baseStyle,
        ...(isHovered ? hoverStyle : {}),
    });

    return (
        <div style={styles.container}>
            <div style={styles.backgroundImage}></div>
            <div style={styles.overlay}></div>
            <div style={styles.backgroundPattern}></div>

            <div>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <div style={styles.logoContainer}>
                            <span style={styles.logo}>🌾</span>
                        </div>
                        <h1 style={styles.title}>Welcome Back</h1>
                        <p style={styles.subtitle}>Sign in to access your CropExpert dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} style={styles.form}>
                        {/* Email Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedInput("email")}
                                onBlur={() => setFocusedInput(null)}
                                required
                                style={getCombinedInputStyle(focusedInput === "email", styles.input, styles.inputFocus)}
                            />
                        </div>

                        {/* Password Input */}
                        <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedInput("password")}
                                onBlur={() => setFocusedInput(null)}
                                required
                                style={getCombinedInputStyle(focusedInput === "password", styles.input, styles.inputFocus)}
                            />
                        </div>

                        {/* Error Message */}
                        {error && <div style={styles.error}>{error}</div>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={getCombinedButtonStyle(isHovering, styles.button, styles.buttonHover)}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div style={styles.footer}>
                        <p style={{ margin: 0 }}>
                            New to CropExpert?{" "}
                            {/* 💡 Use the React Router Link component with 'to' prop */}
                            <Link
                                to="/signup"
                                style={styles.link}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#8BC34A")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#A5D6A7")}
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                <p style={styles.tagline}>Trusted by farmers worldwide for expert crop management</p>
            </div>
        </div>
    )
}

export default LoginForm