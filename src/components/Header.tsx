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
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="https://nextjs.org/icons/next.svg"
                        alt="RagIQ Logo"
                        width={100}
                        height={20}
                        className="dark:invert"
                        priority
                    />
                    <span className="text-xl font-bold text-secondary hidden sm:inline">RagIQ</span>
                </Link>

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