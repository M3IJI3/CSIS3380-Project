import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';

import AvatarCircles from "@/components/magicui/avatar-circles.jsx";

const avatarUrls = [
    "https://github.com/M3IJI3.png",
    "https://avatars.githubusercontent.com/u/20110627",
];

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-white py-6 w-full fixed bottom-0">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left text-slate-400">
                    <h2 className="text-lg">Expense Tracker</h2>
                    <p className="text-sm">© 2024 Expense Tracker. All rights reserved.</p>
                </div>
                <div className="flex space-x-8 mt-4 md:mt-0">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300 hover:bg-slate-900 p-2 rounded-lg">
                        <FontAwesomeIcon icon={faTwitter} size="2x"/>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300 hover:bg-slate-900 p-2 rounded-lg">
                        <FontAwesomeIcon icon={faFacebook} size="2x"/>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300 hover:bg-slate-900 p-2 rounded-lg">
                        <FontAwesomeIcon icon={faInstagram} size="2x"/>
                    </a>
                    <a href="https://github.com/M3IJI3/CSIS3380-Project/tree/main/my-expense-tracker" target="_blank"
                       rel="noopener noreferrer"
                       className="text-slate-400 hover:text-slate-300 hover:bg-slate-900 p-2 rounded-lg">
                        <FontAwesomeIcon icon={faGithub} size="2x"/>
                    </a>

                </div>
                <div className="ms-20 w-fit flex justify-between space-x-3 items-center p-3 hover:bg-slate-900 transform transition duration-300 rounded-lg hover:cursor-pointer border-gray-200">
                    <div className="text-slate-400">
                        Created by
                    </div>
                    <AvatarCircles numPeople={2} avatarUrls={avatarUrls}/>
                </div>
            </div>
        </footer>
    );
}

export default Footer