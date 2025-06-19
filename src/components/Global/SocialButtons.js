import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

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
                    {item.title === "LinkedIn" && (
                        <Image className='opacity-40 hover:opacity-100 hover:scale-110' src="/icons/social/linkedin.svg" alt="Facebook" width={20} height={20} />
                    )}
                    {item.title === "Twitter" && (
                        <Image className='opacity-40 hover:opacity-100 hover:scale-110' src="/icons/social/twitter.svg" alt="Twitter" width={20} height={20} />
                    )}
                </Link>
            ))}
        </div>
    );
};

export default SocialButtons