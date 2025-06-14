// src/components/Home/ServiceSliderPrac.js

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCarouselRotation } from '../../hooks/useCarouselRotation';
import { useBoxStyling } from '../../hooks/useBoxStyling';
import styles from '../../app/RotatingBoxes.module.css';

export default function ServiceSliderPrac({ gallery }) {
    const TOTAL_SLIDES = 9;
    const step = 360 / TOTAL_SLIDES;
    const containerRef = useRef(null);
    const boxRefs = useRef([]);
    const innerFlipRefs = useRef([]);
    const isNavigatingRef = useRef(false);

    const router = useRouter();

    const slideData = gallery;

    const { activeIndex, goToIndex } = useCarouselRotation(containerRef, TOTAL_SLIDES, step);
    useBoxStyling(boxRefs, activeIndex, slideData.map(d => d.image));

    const [flippedIndex, setFlippedIndex] = useState(null);

    const [sliderStyle, setSliderStyle] = useState({ left: '0px', width: '0px' });
    const buttonRefs = useRef([]);
    const categoryListRef = useRef(null);

    const updateSliderPosition = useCallback(() => {
        // Find the index of the corresponding button based on activeCategory
        // Assuming your category list order matches the categoryIndex in slideData for simplicity
        const activeCategory = slideData[activeIndex]?.categoryIndex;

        // More robust way to find the button associated with the active category:
        // You'd need a consistent mapping between your hardcoded category names and slideData.categoryIndex
        // For example, if 'Activation' always corresponds to categoryIndex 0, 'Retail' to 1, etc.
        const categoryNames = ['Activation', 'Retail', 'Content', 'Events', 'Design'];
        const currentActiveCategoryName = categoryNames[activeCategory];


        // Find the button element based on its inner text
        const buttonElement = buttonRefs.current.find(btn =>
            btn && btn.querySelector('p')?.textContent === currentActiveCategoryName
        );

        // Fallback if the above doesn't work or if there's a direct index match
        // This covers cases where categoryIndex directly maps to button's `i`
        let targetButtonIndex = activeCategory;
        if (targetButtonIndex === undefined || targetButtonIndex < 0 || targetButtonIndex >= buttonRefs.current.length) {
            targetButtonIndex = activeIndex; // Fallback to activeIndex of carousel if categoryIndex is problematic
            if (targetButtonIndex >= buttonRefs.current.length) { // Ensure it's within button bounds
                targetButtonIndex = 0; // Default to first button if all else fails
            }
        }
        const finalButtonElement = buttonRefs.current[targetButtonIndex];


        if (finalButtonElement && categoryListRef.current) {
            const listRect = categoryListRef.current.getBoundingClientRect();
            const buttonRect = finalButtonElement.getBoundingClientRect();

            setSliderStyle({
                left: `${buttonRect.left - listRect.left}px`,
                width: `${buttonRect.width}px`,
                height: `${buttonRect.height}px`, // Added height to ensure background covers button
                top: `${buttonRect.top - listRect.top}px`, // Added top for correct vertical alignment
            });
        }
    }, [activeIndex, slideData]);

    useEffect(() => {
        const timeout = setTimeout(updateSliderPosition, 50); // Small delay
        return () => clearTimeout(timeout);
    }, [activeIndex, updateSliderPosition]);

    useEffect(() => {
        window.addEventListener('resize', updateSliderPosition);
        return () => window.removeEventListener('resize', updateSliderPosition);
    }, [updateSliderPosition]);


    const handleCardInteraction = (index) => {
        if (index === activeIndex) {
            if (isNavigatingRef.current) return;
            setFlippedIndex(index);
            const targetUrl = slideData[index]?.url;
            if (targetUrl) {
                isNavigatingRef.current = true;
                setTimeout(() => {
                    router.push(targetUrl);
                }, 300);
            }
        } else {
            goToIndex(index);
        }
    };

    const handleCategoryClick = (buttonIndex) => {
        if (buttonIndex >= 0 && buttonIndex < slideData.length) {
            goToIndex(buttonIndex);
        } else {
            console.warn(`Category button index ${buttonIndex} is out of bounds for slideData.`);
        }
    };

    const headerText = slideData[activeIndex]?.subText || 'LOADING...';
    const currentCategoryIndex = slideData[activeIndex]?.categoryIndex !== undefined
        ? slideData[activeIndex].categoryIndex
        : 0;

    return (
        <section className='flex flex-col justify-center items-center'>
            {/* Added relative positioning for the absolute slider */}
            <div className="relative">
                <ul
                    ref={categoryListRef} // Attach ref to the ul
                    // z-index on ul to ensure buttons are above slider
                    className="flex flex-wrap text-center justify-center gap-y-[-50px] gap-x-2 sm:gap-x-10 relative z-20 px-0"
                >
                    {['Activation', 'Retail', 'Content', 'Event', 'Design'].map((l, i) => (
                        <li
                            key={i}
                            className={`text-white text-sm sm:text-l text-center mt-10`} // Removed opacity-100/50 from li directly
                        >
                            <button
                                ref={el => (buttonRefs.current[i] = el)} // Attach ref to each button
                                // Ensure button has a transparent background or is positioned correctly
                                // relative z-30 (higher than slider)
                                className="px-1 py-1 sm:px-5 sm:py-2 relative z-30 bg-transparent" // Added bg-transparent
                                onClick={() => handleCategoryClick(i)}
                            >
                                <p className={i === currentCategoryIndex ? 'opacity-100' : 'opacity-50'}>{l}</p> {/* Moved opacity to p tag */}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* The sliding background element */}
                <div
                    // The slider should be positioned absolutely relative to the UL
                    // and have a z-index between the UL's background and the button's text
                    // (so, z-20 for slider if buttons are z-30 and UL is z-10)
                    className="absolute bg-pink rounded-3xl transition-all duration-300 ease-out z-10"
                    style={sliderStyle}
                ></div>
            </div>


            <div className="w-full h-[50vh] flex justify-center items-end overflow-hidden relative sm:h-[65vh]">
                <div ref={containerRef} className="w-[400px] h-[400px] mb-[-15vh] translate-y-[15%] relative origin-[50%_50%]
                 xl:w-[1200px] xl:h-[600px] xl:mb-[-12rem] xl:translate-y-[20%]
                 lg:w-[900px] lg:h-[500px] lg:mb-[-12rem] lg:translate-y-[20%] 
                 sm:w-[1500px] sm:h-[1500px] sm:mb-[-35rem]">
                    <svg className={styles.svgPath} viewBox="0 0 400 400">
                        <path
                            strokeWidth="0"
                            stroke="rgba(255, 0, 0, 0.3)"
                            id="myPath"
                            fill="none"
                            d="M396,200 C396,308.24781 308.24781,396 200,396 91.75219,396 4,308.24781 4,200 4,91.75219 91.75219,4 200,4 308.24781,4 396,91.75219 396,200 z"
                        />
                    </svg>
                    
                    {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                        <div
                            key={i}
                            className="box absolute w-[180px] h-[240px] md:max-xl:w-[30vh] md:max-xl:h-[40vh] flex justify-center items-center rounded-[20px] select-none box-border opacity-0 z-0 overflow-hidden"
                            ref={(el) => (boxRefs.current[i] = el)}
                        >
                            <motion.div
                                className={styles['flip-card-inner']}
                                animate={{ rotateX: flippedIndex === i ? 180 : 0 }}
                                transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => handleCardInteraction(i)}
                                onAnimationComplete={() => {
                                    if (flippedIndex === i) {
                                        setFlippedIndex(null);
                                    }
                                    isNavigatingRef.current = false;
                                }}
                                ref={(el) => (innerFlipRefs.current[i] = el)}
                            >
                                <div className="flip-card-front">
                                    <img src={slideData[i]?.image} alt={slideData[i]?.frontText} className="w-full h-full object-cover rounded-2xl" />
                                </div>
                                <div className="flip-card-back">
                                    {/* <img src={slideData[i]?.image} alt={`${slideData[i]?.frontText} Back`} className="w-full h-full object-cover rounded-2xl" /> */}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}