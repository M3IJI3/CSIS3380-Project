import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WelcomePage from './pages/WelcomePage.jsx';
import RegisterPage from "@/pages/RegisterPage.jsx";
import MainPage from "@/pages/MainPage.jsx";
import LoginPage from "./pages/LoginPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="main" element={<MainPage />} />
                </Route>
            </Routes>
            <ToastContainer />
        </Router>
    );
};

export default App;

