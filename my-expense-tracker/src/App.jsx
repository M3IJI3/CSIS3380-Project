import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import LoginForm from './pages/LoginPage';
import RegisterPage from "@/pages/RegisterPage.jsx";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<LoginForm />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

