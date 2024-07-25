import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 w-full fixed bottom-0">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-lg">Expense Tracker</h2>
                    <p className="text-sm">© 2024 Expense Tracker. All rights reserved.</p>
                </div>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300">
                        <FontAwesomeIcon icon={faTwitter} size="2x"/>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300">
                        <FontAwesomeIcon icon={faFacebook} size="2x"/>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300">
                        <FontAwesomeIcon icon={faInstagram} size="2x"/>
                    </a>
                    <a href="https://github.com/M3IJI3/CSIS3380-Project/tree/main/my-expense-tracker" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300">
                        <FontAwesomeIcon icon={faGithub} size="2x"/>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer