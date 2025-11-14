'use client'
import Link from "next/link";
import Image from "next/image";
import React, {useState} from 'react';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: "О нас", href: "/about" },
        { name: "Функционал", href: "/features" },
        { name: "Аналитика", href: "/analytics" },
        { name: "Контакты", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Логотип */}
                <Link href="/" className="logo">
                    <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="95" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>

                        <g id="brain-bg" transform="translate(100, 100) scale(2)" opacity="0.4">
                            <path d="M-20,-10
             C-20,-18 -14,-22 -8,-22
             C-4,-22 0,-20 0,-20
             C0,-20 4,-22 8,-22
             C14,-22 20,-18 20,-10
             C20,-8 19,-6 18,-5
             C19,-3 20,-1 20,2
             C20,10 15,14 10,14
             C7,14 4,13 2,11
             C0,13 -3,14 -6,14
             C-11,14 -16,10 -16,2
             C-16,-1 -15,-3 -14,-5
             C-15,-6 -16,-8 -16,-10
             C-16,-18 -10,-22 -4,-22
             C-2,-22 0,-20 0,-20
             C0,-20 2,-22 4,-22
             C10,-22 16,-18 16,-10
             C16,-8 15,-6 14,-5
             C15,-3 16,-1 16,2
             C16,10 11,14 6,14
             C3,14 0,13 -2,11
             C-4,13 -7,14 -10,14
             C-15,14 -20,10 -20,2
             C-20,-1 -19,-3 -18,-5
             C-19,-6 -20,-8 -20,-10 Z"
                                  fill="none" stroke="#718096" stroke-width="1.5"/>
                            <path d="M-12,-10 C-8,-12 -4,-8 0,-10 C4,-12 8,-8 12,-10" fill="none" stroke="#718096" stroke-width="0.8"/>
                            <path d="M-12,-4 C-8,-6 -4,-2 0,-4 C4,-6 8,-2 12,-4" fill="none" stroke="#718096" stroke-width="0.8"/>
                            <path d="M-12,2 C-8,0 -4,4 0,2 C4,0 8,4 12,2" fill="none" stroke="#718096" stroke-width="0.8"/>
                            <path d="M-12,8 C-8,6 -4,10 0,8 C4,6 8,10 12,8" fill="none" stroke="#718096" stroke-width="0.8"/>
                        </g>


                        <g id="stars">
                            <circle cx="40" cy="40" r="2" fill="#ffffff" opacity="0.8">
                                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="160" cy="50" r="2.5" fill="#ffffff" opacity="0.7">
                                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="150" cy="160" r="1.5" fill="#ffffff" opacity="0.9">
                                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="30" cy="150" r="1.8" fill="#ffffff" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.2s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="170" cy="130" r="2" fill="#ffffff" opacity="0.75">
                                <animate attributeName="opacity" values="0.75;0.3;0.75" dur="1.9s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="60" cy="60" r="1.5" fill="#ffffff" opacity="0.85">
                                <animate attributeName="opacity" values="0.85;0.35;0.85" dur="2.3s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="140" cy="35" r="1.7" fill="#ffffff" opacity="0.7">
                                <animate attributeName="opacity" values="0.7;0.25;0.7" dur="2.1s" repeatCount="indefinite"/>
                            </circle>
                        </g>

                        <ellipse cx="100" cy="100" rx="75" ry="30" fill="none" stroke="#4a5568" stroke-width="1" opacity="0.5" transform="rotate(-20 100 100)"/>
                        <ellipse cx="100" cy="100" rx="60" ry="25" fill="none" stroke="#4a5568" stroke-width="1" opacity="0.5" transform="rotate(30 100 100)"/>
                        <ellipse cx="100" cy="100" rx="45" ry="20" fill="none" stroke="#4a5568" stroke-width="1" opacity="0.5" transform="rotate(-60 100 100)"/>

                        <g id="planets">
                            <circle cx="150" cy="90" r="8" fill="#5f9ea0">
                                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
                            </circle>

                            <circle cx="40" cy="110" r="6" fill="#cd853f">
                                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="-360 100 100" dur="15s" repeatCount="indefinite"/>
                            </circle>

                            <circle cx="100" cy="55" r="5" fill="#9370db">
                                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="10s" repeatCount="indefinite"/>
                            </circle>
                        </g>

                        <g id="neural-core" transform="translate(100, 100)">
                            <circle cx="0" cy="0" r="4" fill="#00d4ff"/>
                            <circle cx="-12" cy="-8" r="3" fill="#00d4ff" opacity="0.8"/>
                            <circle cx="12" cy="-8" r="3" fill="#00d4ff" opacity="0.8"/>
                            <circle cx="-12" cy="8" r="3" fill="#00d4ff" opacity="0.8"/>
                            <circle cx="12" cy="8" r="3" fill="#00d4ff" opacity="0.8"/>

                            <line x1="0" y1="0" x2="-12" y2="-8" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
                            <line x1="0" y1="0" x2="12" y2="-8" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
                            <line x1="0" y1="0" x2="-12" y2="8" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
                            <line x1="0" y1="0" x2="12" y2="8" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
                            <line x1="-12" y1="-8" x2="12" y2="8" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                            <line x1="12" y1="-8" x2="-12" y2="8" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                        </g>
                    </svg>
                </Link>
                {/*Логотип end*/}

                {/* Навигация для десктопа */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 hover:text-secondary font-medium transition duration-150"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Кнопка Гамбургер для мобильных */}
                <button
                    className="md:hidden text-gray-700 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {/* Иконка Гамбургер или Закрыть */}
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Мобильное меню (появляется при isMenuOpen = true) */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <nav className="px-6 pb-4 pt-2 border-t border-gray-100 flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)} // Закрываем меню при клике
                            className="block text-gray-600 hover:text-secondary font-medium transition duration-150 p-2 rounded-lg hover:bg-gray-50"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;