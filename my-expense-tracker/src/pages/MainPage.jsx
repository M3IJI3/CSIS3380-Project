import React from 'react';
import Header from "@/components/Header.jsx";
import MainAside from "@/components/MainAside.jsx";
import MainContent from "@/components/MainContent.jsx";

const MainPage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <MainAside />
            <MainContent />
        </div>
    );
}

export default MainPage;