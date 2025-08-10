import React, { useState } from 'react'
import logo from '../assets/method-logo.png'
import { SlMagnifier, SlMenu } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useMenu } from '../contexts/MenuContext';
import ContactPopup from './ContactPopup';

const NavbarComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const { updateFilters } = useMenu();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Update filters in menu context and navigate to menu page
            updateFilters({ search: searchTerm.trim() });
            navigate('/menu');
        }
    };

    const handleDarkModeToggle = () => {
        console.log('Toggling dark mode, current state:', darkMode);
        toggleDarkMode();
    };

    return (
        <nav className='sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='flex justify-between p-4 items-center max-w-[1400px] mx-auto'>
                {/* Logo */}
                <div>
                    <Link to="/" onClick={closeMenu}>
                        <img src={logo} alt="Methods Grill" className='w-12 hover:scale-105 transition-transform duration-200' />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden'>
                    <button
                        onClick={toggleMenu}
                        className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <IoClose className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <SlMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:block'>
                    <ul className='flex items-center justify-center gap-6'>
                        <li>
                            <Link
                                to="/"
                                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/menu"
                                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors duration-200"
                            >
                                Menu
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => setIsContactPopupOpen(true)}
                                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors duration-200"
                            >
                                Get In Touch
                            </button>
                        </li>

                        {/* Search Bar */}
                        <li>
                            <form onSubmit={handleSearch} className='flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 px-4 rounded-3xl max-w-[300px] border border-gray-200 dark:border-gray-700'>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400'
                                    placeholder="Search menu..."
                                />
                                <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                                    <SlMagnifier />
                                </button>
                            </form>
                        </li>

                        {/* Authentication Section */}
                        {isAuthenticated ? (
                            <li className="flex items-center gap-4">
                                <span className="text-sm text-gray-700 dark:text-gray-300">Welcome, {user?.name}</span>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            ""
                        )}

                        {/* Dark Mode Toggle */}
                        <li>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={handleDarkModeToggle}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                                    dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                    after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 
                                    dark:peer-checked:bg-blue-500 hover:shadow-lg transition-shadow duration-200"
                                ></div>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMenu}
                ></div>
            )}

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="p-6">
                    {/* Mobile Menu Header */}
                    <div className="flex justify-between items-center mb-8">
                        <img src={logo} alt="Methods Grill" className='w-10' />
                        <button
                            onClick={closeMenu}
                            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
                        >
                            <IoClose className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className='flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-6 border border-gray-200 dark:border-gray-700'>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400'
                            placeholder="Search menu..."
                        />
                        <button type="submit" className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                            <SlMagnifier />
                        </button>
                    </form>

                    {/* Mobile Navigation Links */}
                    <ul className='space-y-4 mb-8'>
                        <li>
                            <Link
                                to="/"
                                onClick={closeMenu}
                                className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/menu"
                                onClick={closeMenu}
                                className="block py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                            >
                                Menu
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setIsContactPopupOpen(true);
                                    closeMenu();
                                }}
                                className="block w-full text-left py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                            >
                                Get In Touch
                            </button>
                        </li>
                    </ul>

                    {/* Mobile Authentication Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                        {isAuthenticated ? (
                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Welcome, {user?.name}
                                </div>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        onClick={closeMenu}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-colors duration-200"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>

                    {/* Mobile Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={handleDarkModeToggle}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                                dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 
                                dark:peer-checked:bg-blue-500"
                            ></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Contact Popup */}
            <ContactPopup
                isOpen={isContactPopupOpen}
                onClose={() => setIsContactPopupOpen(false)}
            />
        </nav>
    )
}

export default NavbarComponent
