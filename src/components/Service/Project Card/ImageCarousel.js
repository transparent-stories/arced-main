// components/ImageCarousel.js
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { motion } from 'framer-motion';
import 'keen-slider/keen-slider.min.css';

// Helper function to determine if a URL is a video
const isVideo = (url) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv', '.wmv'];
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    return videoExtensions.includes(extension);
};

// --- Autoplay Plugin for keen-slider ---
const AutoplayPlugin = (delay = 3000) => {
    let timeout;
    let mouseOver = false;
    let isAutoplayActive = false; // Internal state for the plugin

    const startAutoplay = (sliderInstance) => {
        if (!isAutoplayActive) {
            isAutoplayActive = true;
            mouseOver = false;
            clearNextTimeout();
            timeout = setTimeout(() => {
                sliderInstance.next();
            }, delay);
        }
    };

    const stopAutoplay = () => {
        if (isAutoplayActive) {
            isAutoplayActive = false;
            mouseOver = true;
            clearNextTimeout();
        }
    };

    const plugin = (slider) => {
        slider.on('created', () => {
            slider.container.addEventListener('mouseover', () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener('mouseout', () => {
                mouseOver = false;
                if (isAutoplayActive) nextTimeout(slider);
            });
        });

        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', () => {
            if (isAutoplayActive) nextTimeout(slider);
        });
        slider.on('updated', () => {
            if (isAutoplayActive) nextTimeout(slider);
        });
    };

    function clearNextTimeout() {
        clearTimeout(timeout);
    }

    function nextTimeout(sliderInstance) {
        clearTimeout(timeout);
        if (!mouseOver && isAutoplayActive) {
            timeout = setTimeout(() => {
                sliderInstance.next();
            }, delay);
        }
    }

    return [plugin, { start: startAutoplay, stop: stopAutoplay }];
};

// --- ImageCarousel Component ---
const ImageCarousel = ({ title, images, autoPlayOnHover }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const videoRefs = useRef([]); // Ref to store video elements
    const [playingVideoIndex, setPlayingVideoIndex] = useState(null); // State to track which video is playing
    const [isHoveringVideo, setIsHoveringVideo] = useState(false); // State to track if mouse is over the current video slide

    const [autoplayPluginFn, autoplayControls] = useRef(AutoplayPlugin(3000)).current;

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            duration: 500,
            slides: {
                perView: 1,
                spacing: 0,
            },
            initial: 0,
            slideChanged(slider) {
                // Pause any playing video when slide changes

                Object.values(videoRefs.current).forEach(videoElement => {
                    if (videoElement && !videoElement.paused) {
                        videoElement.pause();
                    }
                });
                // if (playingVideoIndex !== null && videoRefs.current[playingVideoIndex]) {
                //     videoRefs.current[playingVideoIndex].pause();
                // }
                setPlayingVideoIndex(null); // Reset playing video index
                setCurrentSlide(slider.track.details.rel);

                // Restart autoplay if it was enabled and the new slide is not a video
                if (autoPlayOnHover && !isVideo(images[slider.track.details.rel])) {
                    autoplayControls.start(slider);
                }
            },
            created(slider) {
                setLoaded(true);
                if (autoPlayOnHover) {
                    autoplayControls.start(slider);
                } else {
                    autoplayControls.stop();
                }
            },
            // Ensure autoplay is stopped when a video slide is about to be displayed
            beforeChange(slider) {
                const nextMedia = images[slider.track.details.abs]; // abs is the absolute index
                if (isVideo(nextMedia)) {
                    autoplayControls.stop();
                }
            },
        },
        [autoplayPluginFn]
    );

    const startAutoplayCallback = useCallback(() => autoplayControls.start(instanceRef.current), [autoplayControls, instanceRef]);
    const stopAutoplayCallback = useCallback(() => autoplayControls.stop(), [autoplayControls]);

    useEffect(() => {
        if (loaded && instanceRef.current) {
            if (autoPlayOnHover) {
                // Only start autoplay if the current slide is not a video and no video is explicitly playing
                if (!isVideo(images[currentSlide]) && playingVideoIndex === null) {
                    startAutoplayCallback();
                }
            } else {
                stopAutoplayCallback();
                // Reset to first slide if autoplay is turned off
                instanceRef.current.moveToIdx(0);
            }
        }
    }, [autoPlayOnHover, loaded, instanceRef, startAutoplayCallback, stopAutoplayCallback, images, currentSlide, playingVideoIndex]);

    const handleVideoPlay = (index) => {
        // Stop autoplay when a video starts playing
        stopAutoplayCallback();
        setPlayingVideoIndex(index);
        if (videoRefs.current[index]) {
            videoRefs.current[index].play();
        }
    };

    const handleVideoPause = (index) => {
        // Restart autoplay when a video is paused, if autoPlayOnHover is true and it's not a video slide anymore
        if (autoPlayOnHover && !isVideo(images[currentSlide])) { // Ensure current slide is not a video
            startAutoplayCallback();
        }
        setPlayingVideoIndex(null); // No video is currently playing
        if (videoRefs.current[index]) {
            videoRefs.current[index].pause();
        }
    };

    const handleVideoEnded = () => {
        // Restart autoplay when a video ends, if autoPlayOnHover is true
        if (autoPlayOnHover) {
            startAutoplayCallback();
        }
        setPlayingVideoIndex(null); // No video is currently playing
        // Optionally move to the next slide after video ends
        instanceRef.current?.next();
    };

    const toggleVideoPlayPause = (index) => {
        if (videoRefs.current[index]) {
            if (videoRefs.current[index].paused) {
                handleVideoPlay(index);
            } else {
                handleVideoPause(index);
            }
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-gray-200 text-gray-500 rounded-lg">
                No images or videos available
            </div>
        );
    }

    return (
    <motion.div
        className="relative w-full aspect-square rounded-xl overflow-hidden group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHoveringVideo(true)}
        onMouseLeave={() => setIsHoveringVideo(false)}
    >
        <div ref={sliderRef} className="keen-slider h-full">
            {images.map((media, idx) => (
                <div key={idx} className="keen-slider__slide h-full flex items-center justify-center relative">
                    {isVideo(media) ? (
                        <div className='relative w-full h-full'> {/* Added w-full h-full here for consistent sizing */}
                            <video
                                ref={(el) => (videoRefs.current[idx] = el)}
                                src={media}
                                controls={false} // Hide default controls
                                className="w-full h-full object-cover" // object-cover applied here
                                onPlay={() => setPlayingVideoIndex(idx)}
                                onPause={() => setPlayingVideoIndex(null)}
                                onEnded={handleVideoEnded}
                                preload="metadata" // Load enough data to get video duration/dimensions
                            />
                            {currentSlide === idx && ( // Only show button for the currently active slide
                                <motion.button
                                    className={`absolute left-[42%] top-[45%] transform w-16 h-16 inset-0 flex items-center justify-center text-black text-4xl rounded-full focus:outline-none z-20 transition-opacity duration-300 ${
                                        // Show button if not playing or if playing and hovered, otherwise hide
                                        (playingVideoIndex !== idx || isHoveringVideo) ? 'opacity-100 bg-white bg-opacity-70' : 'opacity-0'
                                    }`}
                                    onClick={() => toggleVideoPlayPause(idx)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={playingVideoIndex === idx ? "Pause video" : "Play video"}
                                    style={{
                                        // Hide pointer events when video is playing AND not hovered to prevent accidental clicks
                                        pointerEvents: (playingVideoIndex === idx && !isHoveringVideo) ? 'none' : 'auto',
                                    }}
                                >
                                    {videoRefs.current[idx]?.paused && playingVideoIndex !== idx ? (
                                        <span className="text-5xl">&#9658;</span> // Play icon
                                    ) : (
                                        <span className="text-4xl">&#10074;&#10074;</span> // Pause icon
                                    )}
                                </motion.button>
                            )}
                        </div>
                    ) : (
                        <img
                            src={media}
                            alt={`${title} Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    )}
                </div>
            ))}
        </div>

        {/* Navigation Arrows */}
        {loaded && instanceRef.current && images.length > 1 && (
            <>
                <motion.button
                    className="absolute top-1/2 left-2 bg-orange bg-opacity-50 hover:bg-opacity-100 text-black py-2 px-4 rounded-full focus:outline-none z-10 flex md:hidden md:group-hover:flex transform hover:-translate-y-1/2"
                    onClick={() => instanceRef.current?.prev()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Previous slide"
                >
                    &#10094; {/* Left arrow */}
                </motion.button>
                <motion.button
                    className="absolute top-1/2 right-2 bg-orange bg-opacity-50 hover:bg-opacity-100 text-black py-2 px-4 rounded-full focus:outline-none z-10 flex md:hidden md:group-hover:flex transform hover:-translate-y-1/2"
                    onClick={() => instanceRef.current?.next()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next slide"
                >
                    &#10095; {/* Right arrow */}
                </motion.button>
            </>
        )}

        {/* Dots Navigation */}
        {loaded && instanceRef.current && images.length > 1 && (
            <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 gap-1 z-10 flex md:hidden md:group-hover:flex"
            >
                {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => {
                            instanceRef.current?.moveToIdx(idx);
                        }}
                        className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-sky' : 'bg-gray-500'}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Go to slide ${idx + 1}`}
                    ></motion.button>
                ))}
            </div>
        )}
    </motion.div>
);
};

export default ImageCarousel;