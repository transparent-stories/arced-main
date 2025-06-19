// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
import { headers } from 'next/headers';

const ServiceVideo = async ({ desktopVideoSrc, mobileVideoSrc, desktop_poster, mobile_poster }) => {
    

    const userAgent = await headers();
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent.get('user-agent'));

    // Determine which poster to use based on the server-side detection
    const currentPoster = isMobileDevice ? mobile_poster : desktop_poster;

    // Determine which video to use based on screen size
    return (
        <div
            className="relative flex flex-col justify-center items-center video-card"
            data-aos="flip-up"
            data-aos-duration="600"
        >
            <video
                // ref={videoRef}
                className="sm:w-full h-auto overflow-hidden " 
                preload="auto"
                muted
                // muted={muted}
                autoPlay
                playsInline
                loop
                {...(isMobileDevice && { controls: true })}
                {...(currentPoster && { poster: currentPoster })}
            >
                {/* Desktop video for larger screens */}
                <source src={desktopVideoSrc} media="(min-width: 768px)" type="video/mp4" />
                {/* Mobile video for smaller screens */}
                <source src={mobileVideoSrc} media="(max-width: 767px)" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Mute/Unmute Button */}
            {/* <div
                onClick={toggleMute}
                className="absolute bottom-4 right-4 flex items-center justify-center p-3 cursor-pointer bg-gray-100 text-black shadow-lg rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
                <span className="material-icons text-xl">
                    {muted ? "volume_off" : "volume_up"}
                </span>
            </div> */}
        </div>
    );
};

export default ServiceVideo;
