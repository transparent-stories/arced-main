'use client';
import React, { useState, useRef, useEffect } from 'react';

const ServiceVideo = ({ desktopVideoSrc, mobileVideoSrc }) => {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);

    // Toggle mute/unmute functionality
    const toggleMute = () => {
        const newMutedState = !muted;
        setMuted(newMutedState);
        if (videoRef.current) {
            videoRef.current.muted = newMutedState;
        }
    };

    // Determine which video to use based on screen size

    return (
        <div
            className="relative flex flex-col justify-center items-center video-card"
            data-aos="flip-up"
            data-aos-duration="600"
        >
            <video
                ref={videoRef}
                className="sm:w-full h-auto overflow-hidden " 
                preload="auto"
                muted={muted}
                autoPlay
                playsInline
                loop
            >
                {/* Desktop video for larger screens */}
                <source src={desktopVideoSrc} media="(min-width: 768px)" type="video/mp4" />
                {/* Mobile video for smaller screens */}
                <source src={mobileVideoSrc} media="(max-width: 767px)" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {/* Mute/Unmute Button */}
            <div
                onClick={toggleMute}
                className="absolute bottom-4 right-4 flex items-center justify-center p-3 cursor-pointer bg-gray-100 text-black shadow-lg rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
                <span className="material-icons text-xl">
                    {muted ? "volume_off" : "volume_up"}
                </span>
            </div>
        </div>
    );
};

export default ServiceVideo;
