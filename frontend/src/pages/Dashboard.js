"use client"

import { useState, useEffect } from "react"

export default function CropExpertApp() {

    // ✅ Define image list first
    const backgroundImages = [
        "/images/Dashboard.png",
        "/images/login1.jpg",
        "/images/Register.png",
    ];
    const [showFeedback, setShowFeedback] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [isHovering, setIsHovering] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        feedback: "",
    })

    const handleRefresh = () => {
        window.location.reload()
    }

    const handleLogout = () => {
        console.log("Logging out...")
        // Example: window.location.href = "/login";
    }

    const handleFeedbackSubmit = (e) => {
        e.preventDefault()
        console.log("Feedback submitted:", formData)
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: "", email: "", feedback: "" })
            setShowFeedback(false)
        }, 2000)
    }

    // Function to handle card clicks based on their destination type
    const handleCardClick = (destination) => {
        if (destination.startsWith('http')) {
            // External/Full URL redirect
            window.location.href = destination;
        } else if (destination.includes('.html')) {
            // Relative HTML file redirect
            window.location.href = destination;
        } else {
            // Internal React Router navigation (assumes /Store is a React route)
            window.location.href = destination;
            // NOTE: In a professional setup, use useNavigate() here:
            // navigate(destination);
        }
    };


    const features = [
        {
            id: 1,
            title: "Crop Recommendation",
            description: "Get AI-powered crop recommendations based on your soil, climate, and resources",
            icon: "🌾",
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            // 🎯 CRITICAL CHANGE 1: External URL for Flask Form
            destination: "http://localhost:5001/CropForm.html",
        },
        {
            id: 2,
            title: "Agri-Store",
            description: "Browse and purchase quality seeds, fertilizers, and farming equipment",
            icon: "🏪",
            color: "#f59e0b",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            // 🎯 CRITICAL CHANGE 2: Internal React Route (or relative path)
            destination: "/Store",
        },
        {
            id: 3,
            title: "Agri Mitra",
            description: "Chat with our AI-powered farming assistant for expert guidance anytime",
            icon: "💬",
            color: "#3b82f6",
            gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            destination: "/Chat", // ✅ React route
        },

    ]



    // --- [Rest of the existing styles remain the same] ---
    // ... (headerStyle, logoButtonStyle, cardStyle, modalStyle, etc. are omitted for brevity)

    // NOTE: Keep all the style objects here from the original prompt for the code to run fully.

    // --- Styles for card, modal, etc. go here ---
    const headerStyle = {
        position: "sticky", top: 0, zIndex: 50, backgroundColor: "#020617",
        borderBottom: "1px solid #334155", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", flexShrink: 0,
    }
    const headerContentStyle = {
        padding: "1rem 1.5rem", maxWidth: "80rem", margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", width: "100%",
    }
    const logoButtonStyle = {
        display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer",
        border: "none", background: "none", transition: "all 0.3s ease", padding: 0,
    }
    const logoBadgeStyle = {
        width: "2.5rem", height: "2.5rem", background: "linear-gradient(to bottom right, #10b981, #059669)",
        borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.25rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }
    const logoTextStyle = {
        display: "flex", flexDirection: "column", alignItems: "flex-start",
    }
    const logoTitleStyle = {
        fontSize: "1.25rem", fontWeight: "bold", color: "#ffff", transition: "color 0.3s ease",
    }
    const logoSubtitleStyle = {
        fontSize: "0.75rem", color: "#ffffffff", transition: "color 0.3s ease",
    }
    const menuStyle = {
        display: "flex", alignItems: "center", gap: "1rem",
    }
    const buttonStyle = {
        padding: "0.5rem 1rem", border: "none", background: "transparent", color: "#cbd5e1",
        cursor: "pointer", borderRadius: "0.5rem", transition: "all 0.2s ease",
        display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem",
        fontWeight: "500",
    }
    const mainContentStyle = {
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "2rem 1rem",
    }
    const heroStyle = {
        textAlign: "center", marginBottom: "2rem",
    }
    const heroTitleStyle = {
        fontSize: "2.5rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem", lineHeight: 1.2,
    }
    const heroDescriptionStyle = {
        fontSize: "1rem", color: "white", marginBottom: "1rem", lineHeight: 1.6,
    }
    const gridStyle = {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", width: "100%", maxWidth: "1200px",
    }
    const cardStyle = {
        position: "relative", overflow: "hidden", backgroundColor: "rgba(30, 41, 59, 0.5)",
        border: "1px solid #475569", borderRadius: "1rem", transition: "all 0.3s ease",
        backdropFilter: "blur(10px)", cursor: "pointer", padding: "2rem", display: "flex",
        flexDirection: "column", minHeight: "280px",
    }
    const cardIconStyle = {
        width: "3.5rem", height: "3.5rem", borderRadius: "0.75rem",
        padding: "0.75rem", marginBottom: "1rem", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: "1.75rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "all 0.3s ease",
    }
    const cardTitleStyle = {
        fontSize: "1.25rem", fontWeight: "bold", color: "white", marginBottom: "0.75rem",
        transition: "all 0.3s ease",
    }
    const cardDescriptionStyle = {
        color: "white", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem",
        flexGrow: 1, transition: "color 0.3s ease",
    }
    const cardButtonStyle = {
        width: "100%", padding: "0.75rem 1rem", border: "none", borderRadius: "0.5rem",
        color: "white", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease",
        fontSize: "0.875rem",
    }
    const modalBackdropStyle = {
        position: "fixed", inset: 0, zIndex: 50, display: "flex",
        alignItems: "center", justifyContent: "center", padding: "1rem",
        backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)",
    }
    const modalStyle = {
        position: "relative", width: "100%", maxWidth: "42rem",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
        borderRadius: "1.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden", border: "1px solid #475569",
    }
    const modalBackgroundStyle = {
        position: "absolute", inset: 0, opacity: 0.2,
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/Dashboard.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
    }
    const modalContentStyle = {
        position: "relative", padding: "2rem",
    }
    const closeButtonStyle = {
        position: "absolute", top: "1rem", right: "1rem", padding: "0.5rem",
        background: "transparent", border: "none", cursor: "pointer",
        borderRadius: "0.5rem", transition: "background-color 0.3s ease",
        color: "#94a3b8", fontSize: "1.25rem",
    }
    const modalHeaderStyle = {
        marginBottom: "2rem",
    }
    const modalTitleStyle = {
        fontSize: "1.875rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem",
    }
    const modalSubtitleStyle = {
        color: "#94a3b8",
    }
    const formStyle = {
        display: "flex", flexDirection: "column", gap: "1.5rem",
    }
    const formGroupStyle = {
        display: "flex", flexDirection: "column",
    }
    const labelStyle = {
        display: "block", fontSize: "0.875rem", fontWeight: "500",
        color: "#cbd5e1", marginBottom: "0.5rem",
    }
    const inputStyle = {
        backgroundColor: "rgba(30, 41, 59, 0.5)", border: "1px solid #475569",
        color: "white", padding: "0.75rem 1rem", borderRadius: "0.5rem",
        fontSize: "0.875rem", transition: "all 0.3s ease", fontFamily: "inherit",
    }
    const textareaStyle = {
        ...inputStyle, resize: "none", minHeight: "120px",
    }
    const submitButtonStyle = {
        width: "100%", background: "linear-gradient(to right, #10b981, #059669)",
        color: "white", fontWeight: "600", padding: "0.75rem 1rem", border: "none",
        borderRadius: "0.5rem", cursor: "pointer", transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
        fontSize: "0.875rem",
    }
    const successStyle = {
        textAlign: "center", paddingTop: "3rem", paddingBottom: "3rem",
    }
    const successIconStyle = {
        width: "4rem", height: "4rem", background: "linear-gradient(to bottom right, #10b981, #059669)",
        borderRadius: "9999px", display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    }
    const successTitleStyle = {
        fontSize: "1.5rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem",
    }
    const successMessageStyle = {
        color: "#94a3b8",
    }
    // --- End of existing styles ---

    const containerStyle = {
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        backgroundSize: isHovering ? "110%" : "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: isHovering ? "brightness(0.7)" : "brightness(1)",
        transition: "background-image 1.2s ease-in-out, background-size 0.8s ease-in-out, filter 0.8s ease-in-out",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
    }



    const backgroundStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/Dashboard.png)`, // ✅ correct path
        backgroundSize: isHovering ? "110%" : "100%", // Zoom effect
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "all 0.8s ease-in-out", // Smooth transition
        filter: "brightness(0.6)", // Optional dark overlay
    };

    const overlayStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)", // translucent overlay
        zIndex: 1,
    };

    const textStyle = {
        position: "relative",
        zIndex: 2,
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
    };


    // ✅ Auto-change background every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [backgroundImages.length])
    return (
        <div style={containerStyle}>
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        button:hover {
          opacity: 0.9;
        }
      `}</style>

            {/* Header */}
            <header style={headerStyle}>
                <div style={headerContentStyle}>
                    {/* Logo/Title */}
                    <button
                        onClick={handleRefresh}
                        style={logoButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "0.8"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "1"
                        }}
                    >
                        <div style={logoBadgeStyle}>🌾</div>
                        <div style={logoTextStyle}>
                            <h1 style={logoTitleStyle}>CropExpert</h1>
                            <p style={logoSubtitleStyle}>Smart Farming Solutions</p>
                        </div>
                    </button>

                    {/* Menu Items */}
                    <div style={menuStyle}>
                        <button
                            onClick={() => setShowFeedback(true)}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#1e293b"
                                e.currentTarget.style.color = "white"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent"
                                e.currentTarget.style.color = "#cbd5e1"
                            }}
                        >
                            💬 Feedback
                        </button>

                        <button
                            onClick={handleLogout}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#1e293b"
                                e.currentTarget.style.color = "#f87171"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent"
                                e.currentTarget.style.color = "#cbd5e1"
                            }}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Hero + Cards */}
            <div style={mainContentStyle}>
                {/* Hero Section */}
                <div style={heroStyle}>
                    <h1 style={heroTitleStyle}>Empower Your Farming Journey</h1>
                    <p style={heroDescriptionStyle}>Smart solutions for modern agriculture</p>
                </div>

                {/* Features Grid */}
                <div style={gridStyle}>
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            style={cardStyle}
                            // 🎯 CRITICAL CHANGE: Use handleCardClick for navigation
                            onClick={() => handleCardClick(feature.destination)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#64748b"
                                e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                e.currentTarget.style.transform = "translateY(-5px)"
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#475569"
                                e.currentTarget.style.boxShadow = "none"
                                e.currentTarget.style.transform = "translateY(0)"
                            }}
                        >
                            <div
                                style={{
                                    ...cardIconStyle,
                                    background: feature.gradient,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.1)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)"
                                }}
                            >
                                {feature.icon}
                            </div>

                            <h3 style={cardTitleStyle}>{feature.title}</h3>
                            <p style={cardDescriptionStyle}>{feature.description}</p>

                            <button
                                style={{
                                    ...cardButtonStyle,
                                    background: feature.gradient,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)"
                                }}
                                // The button also triggers the navigation on click
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents double-triggering from card click
                                    handleCardClick(feature.destination);
                                }}
                            >
                                Explore Now →
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedback && (
                <div style={modalBackdropStyle} onClick={() => setShowFeedback(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={modalBackgroundStyle}></div>

                        <div style={modalContentStyle}>
                            <button
                                onClick={() => setShowFeedback(false)}
                                style={closeButtonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#475569"
                                    e.currentTarget.style.color = "white"
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent"
                                    e.currentTarget.style.color = "#94a3b8"
                                }}
                            >
                                ✕
                            </button>

                            <div style={modalHeaderStyle}>
                                <h2 style={modalTitleStyle}>Share Your Feedback</h2>
                                <p style={modalSubtitleStyle}>Help us improve CropExpert with your valuable insights</p>
                            </div>

                            {!submitted ? (
                                <form onSubmit={handleFeedbackSubmit} style={formStyle}>
                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Your Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label style={labelStyle}>Your Feedback</label>
                                        <textarea
                                            placeholder="Tell us what you think about CropExpert..."
                                            value={formData.feedback}
                                            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                            required
                                            style={textareaStyle}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={submitButtonStyle}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(16, 185, 129, 0.3)"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = "none"
                                        }}
                                    >
                                        ✉️ Send Feedback
                                    </button>
                                </form>
                            ) : (
                                <div style={successStyle}>
                                    <div style={successIconStyle}>✓</div>
                                    <h3 style={successTitleStyle}>Thank You!</h3>
                                    <p style={successMessageStyle}>Your feedback has been received. We appreciate your input!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}