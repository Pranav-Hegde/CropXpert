import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <div className="bg-black text-light py-5 min-vh-100">
            <Container>
                <h2 className="text-center mb-4 fw-bold">🌾 About Smart Crop Recommender</h2>
                <p className="text-center mb-5 fs-5 text-secondary">
                    Empowering agriculture with Artificial Intelligence and intuitive technology.
                </p>

                <Row className="g-4">
                    <Col md={6}>
                        <Card className="bg-light text-dark shadow-lg border-0 h-100">
                            <Card.Body>
                                <Card.Title>💡 What is Smart Crop Recommender?</Card.Title>
                                <Card.Text>
                                    A web-based solution to guide farmers in selecting the most suitable crop based on soil and climatic conditions. It bridges agriculture and AI to boost productivity.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="bg-light text-dark shadow-lg border-0 h-100">
                            <Card.Body>
                                <Card.Title>🛠️ Tech Stack</Card.Title>
                                <Card.Text>
                                    <ul>
                                        <li><strong>Frontend:</strong> React + Bootstrap</li>
                                        <li><strong>Auth/API:</strong> Node.js + Express (MERN)</li>
                                        <li><strong>Database:</strong> MongoDB</li>
                                        <li><strong>ML Backend:</strong> Python + Flask</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="bg-light text-dark shadow-lg border-0 h-100">
                            <Card.Body>
                                <Card.Title>📊 How It Works</Card.Title>
                                <Card.Text>
                                    Farmers input key parameters like N, P, K, temperature, humidity, pH, and rainfall. These values are processed through a Flask-based ML model to predict the optimal crop.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="bg-light text-dark shadow-lg border-0 h-100">
                            <Card.Body>
                                <Card.Title>🔐 User-Friendly System</Card.Title>
                                <Card.Text>
                                    The MERN stack handles secure user registration, login, and session flow, ensuring a smooth and intuitive experience for farmers accessing intelligent insights.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <div className="text-center mt-5">
                    <p className="text-secondary">
                        Built with ❤️ using modern technologies to enhance farming practices.
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default AboutPage;
