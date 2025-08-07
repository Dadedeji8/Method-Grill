import React, { useEffect, useState } from 'react'
import logo from '../assets/method-logo.png'
import { SlMagnifier, SlMenu } from "react-icons/sl";
const NavbarComponent = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className='flex justify-between p-4 items-center  border-b-2 border-gray-200 max-w-[1400px] mx-auto'>
            <div>
                <img src={logo} alt="" className='w-12 ' />
            </div>
            <div className='md:hidden cursor-pointer'><SlMenu /></div>
            <div className='hidden md:block'>
                <ul className='flex items-center justify-center gap-4  '>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Get In Touch</a></li>
                    <li>
                        <div className='flex items-center justify-center gap-2 bg-red-50 p-2 px-4 rounded-3xl  max-w-[300px]'>
                            <input type="text" className='w-full active:outline-none focus:outline-none' />
                            <SlMagnifier />
                        </div>
                    </li>

                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                  dark:bg-red-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 
                  dark:peer-checked:bg-red-200"
                        ></div>
                    </label>


                </ul>
            </div>
        </div>
    )
}

export default NavbarComponent
