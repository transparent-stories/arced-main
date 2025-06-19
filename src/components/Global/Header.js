// components/Header.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import SocialButtons from './SocialButtons';



// Data for menu and socials
const menu = [
    {
        title: "Home",
        link: "/"
    },
    {
        title: "About Us",
        link: "/about"
    },
    {
        title: "Contact",
        link: "/contact-us"
    }
];

const socials = [
    {
        title: "Instgram",
        link: "https://www.instagram.com/arcedmarketing"
    },
    // {
    //     title: "Facebook",
    //     link: "https://facebook.com"
    // },
    {
        title: "LinkedIn",
        link: "https://www.linkedin.com/company/arced-marketing/"
    },
    // {
    //     title: "Twitter",
    //     link: "https://x.com"
    // }
];

const Header = ({header_text}) => {
    return (
        <header className="px-5 sm:px-20 py-5 font-bold flex justify-between items-center bg-transparent absolute top-0 w-full text-white z-20">
            {/* Flyout Menu on the left */}
            <div className='flex flex-row relative justify-start items-center gap-5'>
                <FlyoutMenu menuItems={menu} />
                {header_text && <h1 data-aos="fade-right" className='ml-10 w-max text-3xl hidden sm:block absolute'>{header_text}</h1>}
            </div>

            {/* Logo in the center */}
            <div className="flex-1 flex justify-center items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="ARCED logo"
                        // The 'sizes' prop is commented out, ensure 'width' and 'height' are appropriate
                        // or uncomment 'sizes' and provide correct values for responsive image loading.
                        width={300} // Set a base width for the logo
                        height={250} // Set a base height for the logo
                        className="transition-transform duration-500 transform hover:scale-110 fill-green
                        w-40 h-auto sm:w-40 md:w-48 lg:w-60 xl:w-48" // Responsive width classes
                    />
                </Link>
            </div>

            {/* Social Buttons on the right */}
            <div className="flex flex1 justify-end items-center">
                <SocialButtons socialItems={socials} />
            </div>
        </header>
    );
};

// FlyoutMenu Component
const FlyoutMenu = ({ menuItems }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-30"> {/* Increased z-index to ensure menu is on top */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-8 w-8 flex-col items-center justify-center rounded-md p-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                <div
                    className={`
                        h-0.5 w-6 rounded-full bg-white transition-all duration-300
                        ${isOpen ? 'translate-y-2 rotate-45' : ''}
                    `}
                ></div>
                <div
                    className={`
                        h-0.5 w-6 rounded-full bg-white transition-all duration-300 my-1
                        ${isOpen ? 'opacity-0' : 'opacity-100'}
                    `}
                ></div>
                <div
                    className={`
                        h-0.5 w-6 rounded-full bg-white transition-all duration-300
                        ${isOpen ? '-translate-y-2 -rotate-45' : ''}
                    `}
                ></div>
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {item.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Header;