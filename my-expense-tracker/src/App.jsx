import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import LoginPage from './pages/LoginPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

