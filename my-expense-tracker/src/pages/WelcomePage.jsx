import React from 'react';
import Header from '../components/Header';
import WelcomeContent from "@/components/WelcomeContent.jsx";
import Footer from "@/components/Footer.jsx";

const WelcomePage = () => {
    return (
        <>
            <Header />
            <WelcomeContent />
            <Footer />
        </>
    );
}

export default WelcomePage;
