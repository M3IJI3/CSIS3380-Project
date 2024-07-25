import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/coin-icon.svg'

const Header = () => {
    return (
        <header className="p-4 text-black flex justify-between items-center">
            <Link to="/" className="ms-20 flex text-3xl text-blue-800 hover:cursor-pointer">
                <img src={logo} alt="logo" className="mr-2"/>
                <h1 className="font-sans mt-1">Expense</h1>
                <h1 className="font-sans font-bold mt-1">Tracker</h1>
            </Link>

            <nav>
                <Link to="/login" className="ps-8 pe-8 pt-2 pb-2 mr-20 border border-blue-800 text-blue-800 rounded-3xl hover:bg-blue-800 transform transition duration-300 hover:text-blue-50">Login</Link>
            </nav>
        </header>
    );
}

export default Header;
