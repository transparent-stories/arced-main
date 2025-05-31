// src/components/Home/ServiceSliderPrac.js

'use client';

import React, { useRef, useState } from 'react';
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
    const isNavigatingRef = useRef(false); // New ref to prevent multiple navigations

    const router = useRouter();

    const slideData = gallery

    // const slideData = [
    //     {
    //         image: '/home/service1.jpg',
    //         frontText: 'Activation',
    //         backContent: 'Details for Activation services. This content can be more extensive for Activation.',
    //         subText: 'ACTIVATIONS',
    //         categoryIndex: 0,
    //         url: "/service/activations"
    //     },
    //     {
    //         image: '/home/service2.jpg',
    //         frontText: 'Retail',
    //         backContent: 'Explore our Retail solutions tailored for modern businesses.',
    //         subText: 'RETAIL',
    //         categoryIndex: 1,
    //         url: "/service/retail"
    //     },
    //     {
    //         image: '/home/service3.jpg',
    //         frontText: 'Content',
    //         backContent: 'Creative and engaging Content strategies to boost your brand.',
    //         subText: 'CONTENT',
    //         categoryIndex: 2,
    //         url: "/service/content"
    //     },
    //     {
    //         image: '/home/service4.jpg',
    //         frontText: 'Event',
    //         backContent: 'Seamless Event management from concept to execution.',
    //         subText: 'EVENT',
    //         categoryIndex: 3,
    //         url: "/service/event"
    //     },
    //     {
    //         image: '/home/service5.jpg',
    //         frontText: 'Design',
    //         backContent: 'Innovative Design approaches for compelling user experiences.',
    //         subText: 'DESIGN',
    //         categoryIndex: 4,
    //         url: "/service/design"
    //     },
    //     {
    //         image: '/home/service1.jpg',
    //         frontText: 'Digital',
    //         backContent: 'Comprehensive digital marketing and strategy solutions.',
    //         subText: 'ACTIVATIONS',
    //         categoryIndex: 0,
    //         url: "/service/activations"
    //     },
    //     {
    //         image: '/home/service2.jpg',
    //         frontText: 'Strategy',
    //         backContent: 'Strategic planning and consulting for business growth.',
    //         subText: 'RETAIL',
    //         categoryIndex: 1,
    //         url: "/service/retail"
    //     },
    //     {
    //         image: '/home/service3.jpg',
    //         frontText: 'Analytics',
    //         backContent: 'Data analytics to drive informed business decisions.',
    //         subText: 'CONTENT',
    //         categoryIndex: 2,
    //         url: "/service/content"
    //     },
    //     {
    //         image: '/home/service4.jpg',
    //         frontText: 'Support',
    //         backContent: 'Ongoing support and maintenance for all your needs.',
    //         subText: 'EVENT',
    //         categoryIndex: 3,
    //         url: "/service/design"
    //     },
    // ];

    const { activeIndex } = useCarouselRotation(containerRef, TOTAL_SLIDES, step);
    useBoxStyling(boxRefs, activeIndex, slideData.map(d => d.image));

    const [flippedIndex, setFlippedIndex] = useState(null);

    // This handles both the flip and initiates navigation directly for the active card
    const handleCardInteraction = (index) => {
        if (index === activeIndex) {
            // Prevent multiple navigations if already initiated
            if (isNavigatingRef.current) return;

            setFlippedIndex(index); // Initiate the flip animation

            const targetUrl = slideData[index].url;
            if (targetUrl) {
                isNavigatingRef.current = true; // Set flag to true

                // Delay the navigation slightly more to allow the flip to be visible
                // A very small delay (e.g., 50ms-100ms) can improve reliability on mobile
                // while still feeling seamless. You can even set it to the animation duration.
                setTimeout(() => {
                    router.push(targetUrl);
                }, 500); // Increased delay slightly for better mobile reliability and visual effect
            }
        }
    };

    const headerText = slideData[activeIndex]?.subText || 'LOADING...';
    const currentCategoryIndex = slideData[activeIndex]?.categoryIndex !== undefined
        ? slideData[activeIndex].categoryIndex
        : 0;

    return (
        <section className='flex flex-col justify-center items-center'>
            <p className="text-white opacity-50 text-center mt-5 text-xl">
                {headerText}
            </p>

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
                            className={`${styles.box} box`}
                            ref={(el) => (boxRefs.current[i] = el)}
                        >
                            <motion.div
                                className={styles['flip-card-inner']}
                                animate={{ rotateX: flippedIndex === i ? 180 : 0 }}
                                transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => handleCardInteraction(i)}
                                onAnimationComplete={() => {
                                    if (flippedIndex === i) {
                                        setFlippedIndex(null); // Reset after flip to prepare for next interaction
                                    }
                                    isNavigatingRef.current = false; // Reset flag after navigation (or animation completion)
                                }}
                                ref={(el) => (innerFlipRefs.current[i] = el)}
                            >

                                <div className="flip-card-front">
                                    <img src={slideData[i].image} alt={slideData[i].frontText} className="w-full h-full object-cover rounded-2xl" />
                                </div>

                                <div className="flip-card-back">
                                    <img src={slideData[i].image} alt={`${slideData[i].frontText} Back`} className="w-full h-full object-cover rounded-2xl" />
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            <ul className="flex text-center justify-center text-2xl gap-5">
                {['A', 'R', 'C', 'E', 'D'].map((l, i) => (
                    <li
                        key={i}
                        className={`text-white text-center mt-10 ${i === currentCategoryIndex ? 'opacity-100' : 'opacity-50'}`}
                    >
                        {l}
                    </li>
                ))}
            </ul>
        </section>
    );
}
