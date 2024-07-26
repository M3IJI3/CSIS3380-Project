import React from 'react';
import { Link } from 'react-router-dom';

import SparklesText from "@/components/magicui/sparkles-text.jsx";
import ShinyButton from "@/components/magicui/shiny-button.jsx";
import MarqueeDemo from "@/components/WelcomeMarquee.jsx";

const WelcomeContent = () => {
    return (
        <>
            <div className="custom-scrollbar flex">
                <div className="relative w-screen h-fit flex flex-col">
                    <SparklesText
                        className="mt-20 text-slate-600 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center"
                        text="Spend too much everyday ?"/>
                    <SparklesText
                        className="mb-5 text-slate-600 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center"
                        text="We're here to save your money !"/>
                    <p className="text-center text-lg text-gray-500 mb-20 whitespace-pre-line">
                        "Discover the ultimate solution for managing your daily expenses. Our smart budgeting tools help
                        you
                        track spending and achieve {"\n"} your financial goals effortlessly. Say goodbye to overspending
                        and hello to
                        financial freedom with our user-friendly platform."
                    </p>

                    <div className="flex justify-center">
                        <Link to="/register">
                            <ShinyButton text="Get started"/>
                        </Link>

                        <form action="#" className="relative ms-10">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round"
                                 className="flex-none text-slate-400 dark:text-slate-400" aria-hidden="true">
                        <path d="m19 19-3.5-3.5"></path>
                        <circle cx="11" cy="11" r="6"></circle>
                    </svg>
                        </span>
                            <input
                                className="pl-10 pr-4 py-3 shadow-sm rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                placeholder="Quick search..."
                            />
                        </form>
                    </div>
                    <MarqueeDemo/>
                </div>
            </div>
        </>
    );
}

export default WelcomeContent;