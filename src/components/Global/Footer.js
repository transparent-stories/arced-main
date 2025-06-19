import React from 'react';

const Footer = () => {
    // Get the current year dynamically
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-black text-white py-4 px-5 sm:px-20 flex flex-col items-center justify-center text-center'>
            <p className="text-sm">
                &copy; {currentYear} ARCED. All rights reserved.
            </p>
            {/* You can add more footer content here if needed, like links or social icons */}
        </footer>
    );
}

export default Footer;