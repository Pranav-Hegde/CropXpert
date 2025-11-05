import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Container, Tab, Nav, Card } from 'react-bootstrap';

const AuthPage = () => {
    const [key, setKey] = useState('login');

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow-lg" style={{ width: '400px' }}>
                <Nav variant="tabs" activeKey={key} onSelect={(k) => setKey(k)}>
                    <Nav.Item>
                        <Nav.Link eventKey="login">Login</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="register">Register</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="mt-4">
                    <Tab.Pane eventKey="login">
                        <LoginForm />
                    </Tab.Pane>
                    <Tab.Pane eventKey="register">
                        <RegisterForm />
                    </Tab.Pane>
                </Tab.Content>
            </Card>
        </Container>
    );
};

export default AuthPage;
