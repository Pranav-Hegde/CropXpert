import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/Signup';
import LoginForm from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import DashBoard from './pages/Dashboard';
import Store from './pages/Store'
import Chat from './pages/Chat'
import { Link } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Dashboard" element={<DashBoard />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/Chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;