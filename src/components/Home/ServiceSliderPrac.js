// src/components/Home/ServiceSliderPrac.js
'use client'

import React, { useRef } from 'react';
import { useCarouselRotation } from '../../hooks/useCarouselRotation';
import { useBoxStyling } from '../../hooks/useBoxStyling'; // Import the new styling hook
import styles from '../../app/RotatingBoxes.module.css'; // Make sure this path is correct

export default function ServiceSliderPrac() {
    const TOTAL_SLIDES = 9;
    const step = 360 / TOTAL_SLIDES; // degrees per dot

    const containerRef = useRef(null); // Ref to the draggable container
    const boxRefs = useRef([]); // Ref to store individual box elements for styling

    // Array of image URLs for each box
    // IMPORTANT: Make sure these images exist in your public/images folder
    const boxImages = [
        '/home/service1.jpg',
        '/home/service2.jpg',
        '/home/service3.jpg',
        '/home/service4.jpg',
        '/home/service5.jpg',
        '/home/service1.jpg',
        '/home/service2.jpg',
        '/home/service3.jpg',
        '/home/service4.jpg',
    ];

    // Use custom hooks
    const { activeIndex } = useCarouselRotation(containerRef, TOTAL_SLIDES, step);
    // Pass boxImages to useBoxStyling
    useBoxStyling(boxRefs, activeIndex, boxImages); // This hook handles the active/hover styling

    return (
        <>
            <p className='text-white opacity-50 text-center mt-10 text-sm'>ACTIVATIONS</p>
            <div className={styles.wrapper}>
                <div ref={containerRef} className={styles.container}>
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
                            // We use `styles.box` for the base styling and "box" for `useCarouselRotation`
                            className={`${styles.box} box`}
                            ref={el => boxRefs.current[i] = el} // Store ref to each box
                        >
                            {/* Box {i + 1} */}
                        </div>
                    ))}
                </div>
            </div>
            <ul className='flex text-center justify-center text-2xl'>
                <li className='text-white opacity-50 text-center mt-10'>A</li>
                <li className='text-white opacity-50 text-center mt-10'>R</li>
                <li className='text-white opacity-50 text-center mt-10'>C</li>
                <li className='text-white opacity-50 text-center mt-10'>E</li>
                <li className='text-white opacity-50 text-center mt-10'>D</li>
            </ul>

        </>
    );
}