"use client"

import React from "react"
import { Container, Navbar, Nav, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
    FaSeedling,
    FaSignInAlt,
    FaUserPlus,
    FaInfoCircle,
    FaLeaf,
    FaChartLine,
    FaGlobeAmericas,
    FaArrowRight,
} from "react-icons/fa"

const HomePage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    }

    const styles = {
        navbar: {
            background: "linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            padding: "1rem 0",
            borderBottom: "3px solid #4ade80",
        },
        navBrand: {
            fontSize: "1.8rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #4ade80 0%, #86efac 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
        },
        navLink: {
            color: "#4ade80",
            fontSize: "1rem",
            fontWeight: "600",
            marginLeft: "1.5rem",
            transition: "all 0.3s ease",
        },
        heroSection: {
            background: "linear-gradient(135deg, #0f172a 0%, #1a3a2a 50%, #0f2818 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
        },
        heroOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
                "radial-gradient(circle at 20% 50%, rgba(74, 222, 128, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
        },
        heroContent: {
            position: "relative",
            zIndex: 2,
            textAlign: "center",
        },
        heroTitle: {
            fontSize: "4rem",
            fontWeight: "900",
            color: "#f0fdf4",
            lineHeight: "1.2",
            marginBottom: "1.5rem",
        },
        heroSubtitle: {
            fontSize: "1.3rem",
            color: "#d1fae5",
            lineHeight: "1.8",
            marginBottom: "2rem",
            fontWeight: "500",
            maxWidth: "600px",
            margin: "0 auto 2rem",
        },
        ctaButton: {
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
            border: "none",
            padding: "1rem 2.5rem",
            fontSize: "1.1rem",
            fontWeight: "700",
            borderRadius: "50px",
            color: "#0f172a",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(74, 222, 128, 0.3)",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
        },
        ctaButtonHover: {
            transform: "translateY(-3px)",
            boxShadow: "0 15px 40px rgba(74, 222, 128, 0.4)",
        },
        featuresSection: {
            background: "linear-gradient(180deg, #0f172a 0%, #1a3a2a 100%)",
            padding: "5rem 0",
        },
        featuresSectionTitle: {
            fontSize: "2.8rem",
            fontWeight: "900",
            color: "#f0fdf4",
            marginBottom: "3rem",
            textAlign: "center",
        },
        featureCard: {
            background: "linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
            border: "2px solid rgba(74, 222, 128, 0.3)",
            borderRadius: "20px",
            padding: "2.5rem",
            textAlign: "center",
            transition: "all 0.4s ease",
            cursor: "pointer",
        },
        footer: {
            background: "linear-gradient(135deg, #0f172a 0%, #1a2332 100%)",
            color: "#d1fae5",
            padding: "2rem 0",
            textAlign: "center",
            fontSize: "0.95rem",
        },
        footerLink: {
            color: "#4ade80",
            textDecoration: "none",
            fontWeight: "600",
        },
    }

    const [hoveredButton, setHoveredButton] = React.useState(false)

    return (
        <>
            {/* ✅ FIXED NAVBAR */}
            <Navbar expand="lg" style={styles.navbar}>
                <Container>
                    <Navbar.Brand as={Link} to="/" style={styles.navBrand}>
                        <FaSeedling style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                        CropExpert
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: "#4ade80" }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {[
                                { to: "/login", icon: <FaSignInAlt />, text: "Login" },
                                { to: "/signup", icon: <FaUserPlus />, text: "Register" },
                                { to: "/about", icon: <FaInfoCircle />, text: "About" },
                            ].map((item, index) => (
                                <Nav.Link
                                    as={Link}
                                    to={item.to}
                                    key={index}
                                    style={styles.navLink}
                                    onMouseEnter={(e) => (e.target.style.color = "#86efac")}
                                    onMouseLeave={(e) => (e.target.style.color = "#4ade80")}
                                >
                                    {item.icon} {item.text}
                                </Nav.Link>
                            ))}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* HERO SECTION */}
            <div style={styles.heroSection}>
                <div style={styles.heroOverlay}></div>
                <Container style={styles.heroContent}>
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <Row className="justify-content-center">
                            <Col md={10} lg={9}>
                                <motion.h1 style={styles.heroTitle} variants={itemVariants}>
                                    Revolutionize Your Farming with AI
                                </motion.h1>
                                <motion.p style={styles.heroSubtitle} variants={itemVariants}>
                                    Get intelligent crop recommendations powered by advanced machine learning.
                                </motion.p>
                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/signup"
                                        style={{
                                            ...styles.ctaButton,
                                            ...(hoveredButton ? styles.ctaButtonHover : {}),
                                        }}
                                        onMouseEnter={() => setHoveredButton(true)}
                                        onMouseLeave={() => setHoveredButton(false)}
                                    >
                                        Start Your Journey <FaArrowRight style={{ marginLeft: "0.5rem" }} />
                                    </Link>
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>
                </Container>
            </div>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <Container>
                    <p>© {new Date().getFullYear()} CropExpert AI. All rights reserved.</p>
                    <p>
                        <Link to="/privacy" style={styles.footerLink}>
                            Privacy Policy
                        </Link>{" "}
                        |{" "}
                        <Link to="/terms" style={{ ...styles.footerLink, marginLeft: "0.5rem" }}>
                            Terms of Service
                        </Link>
                    </p>
                </Container>
            </footer>
        </>
    )
}

export default HomePage
