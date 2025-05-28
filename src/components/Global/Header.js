// components/Header.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';



// Data for menu and socials
const menu = [
    {
        title: "Home",
        link: "/"
    },
    {
        title: "Contact",
        link: "/contact-us"
    },
    {
        title: "ARCED",
        link: "/"
    }
];

const socials = [
    {
        title: "Instgram",
        link: "https://instagram.com"
    },
    {
        title: "Facebook",
        link: "https://facebook.com"
    },
    {
        title: "Twitter",
        link: "https://x.com"
    }
];

const Header = () => {
    return (
        <header className="sm:px-20 py-5 font-bold flex justify-between items-center bg-black text-white sticky top-0 z-20">
            {/* Flyout Menu on the left */}
            <FlyoutMenu menuItems={menu} />

            {/* Logo in the center */}
            <Link href="/">
                <Image
                    src="/logo.webp"
                    alt="ARCED logo"
                    width={200}
                    height={250}
                    className="transition-transform duration-500 transform hover:scale-110 fill-green"
                />
            </Link>

            {/* Social Buttons on the right */}
            <SocialButtons socialItems={socials} />
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

// SocialButtons Component
const SocialButtons = ({ socialItems }) => {
    return (
        <div className="flex space-x-4">
            {socialItems.map((item, index) => (
                <Link key={index} href={item.link} className="text-white hover:text-gray-300" aria-label={item.title}>
                    {/* Replace with actual social icons (e.g., Font Awesome, SVG icons) */}
                    {item.title === "Instgram" && (
                        <Image className='opacity-40 hover:opacity-100 hover:scale-110' src="/icons/social/instagram.svg" alt="Instagram" width={20} height={20} />
                    )}
                    {item.title === "Facebook" && (
                        <Image className='opacity-40 hover:opacity-100 hover:scale-110' src="/icons/social/facebook.svg" alt="Facebook" width={20} height={20} />
                    )}
                    {item.title === "Twitter" && (
                        <Image className='opacity-40 hover:opacity-100 hover:scale-110' src="/icons/social/twitter.svg" alt="Twitter" width={20} height={20} />
                    )}
                </Link>
            ))}
        </div>
    );
};

export default Header;