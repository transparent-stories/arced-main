// src/hooks/useCarouselRotation.js
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable, MotionPathPlugin, InertiaPlugin } from 'gsap/all';

// Register GSAP plugins only once
gsap.registerPlugin(Draggable, InertiaPlugin, MotionPathPlugin);

// This ensures box 0 is perfectly centered when the carousel is at 0 rotation.
// Adjust this value if your box 0 is slightly off-center initially.
const ROTATION_ALIGNMENT_CORRECTION = 0;

export const useCarouselRotation = (containerRef, totalSlides, step) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const rotationTweenRef = useRef(null); // Ref for autoplay tween
    const draggableInstanceRef = useRef(null); // Ref for Draggable instance

    // Calculates which box is currently at the 'top' (active position) based on container rotation
    const calculateActiveIndex = useCallback((currentRotation) => {
        let effectiveRotation = currentRotation + ROTATION_ALIGNMENT_CORRECTION;
        let normalizedRotation = effectiveRotation % 360;
        if (normalizedRotation < 0) {
            normalizedRotation += 360;
        }
        const rawIndex = Math.round((360 - normalizedRotation) / step) % totalSlides;
        return (rawIndex + totalSlides) % totalSlides; // Ensure positive index
    }, [step, totalSlides]);

    // Starts the continuous autoplay rotation
    const startAutoplay = useCallback(() => {
        if (rotationTweenRef.current) {
            rotationTweenRef.current.kill(); // Kill any existing autoplay
        }

        const containerElement = containerRef.current;
        if (!containerElement) return;

        const currentRotation = gsap.getProperty(containerElement, 'rotation');
        const targetRotation = currentRotation - step; // Rotate counter-clockwise to advance slides

        rotationTweenRef.current = gsap.to(containerElement, {
            rotation: targetRotation,
            duration: 0.8, // Duration of one slide rotation
            ease: "power2.out",
            onUpdate: () => {
                const currentAnimatedRotation = gsap.getProperty(containerElement, 'rotation');
                setActiveIndex(calculateActiveIndex(currentAnimatedRotation));
            },
            onComplete: () => startAutoplay(), // Loop the autoplay
            delay: 2.5 // Delay before the next slide rotates
        });
    }, [step, calculateActiveIndex, containerRef]);

    // Stops the autoplay rotation
    const stopAutoplay = useCallback(() => {
        if (rotationTweenRef.current) {
            rotationTweenRef.current.pause(); // Pause the autoplay tween
        }
    }, []);

    // Initializes Draggable and sets up motion path for boxes
    useEffect(() => {
        const path = document.getElementById('myPath');
        if (!path) {
            console.error("SVG path with ID 'myPath' not found!");
            return;
        }

        // Use a direct class selector for boxes, as the component will render them with this class
        const boxes = gsap.utils.toArray(containerRef.current.querySelectorAll('.box'));
        const boxesAmount = boxes.length;

        // Ensure container rotation is reset and box props are cleared on mount
        gsap.set(containerRef.current, { rotation: 0 });
        gsap.set(boxes, { clearProps: "all" });

        // Initial setup for boxes along the path
        gsap.set(boxes, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                start: -0.25, // Box 0 starts at 12 o'clock
                end: (i) => i / boxesAmount - 0.25, // Distribute boxes evenly
                autoRotate: true
            },
            opacity: 0.7, // Initial opacity for inactive boxes
            zIndex: 1, // Base z-index
            scale: 1, // Base scale
            backgroundColor: '#c3c3c3', // Default inactive color
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' // Default inactive shadow
        });

        // Initialize Draggable instance only once
        if (!draggableInstanceRef.current) {
            draggableInstanceRef.current = Draggable.create(containerRef.current, {
                type: 'rotation',
                inertia: true,
                snap: (endValue) => gsap.utils.snap(step, endValue),
                onDragStart: stopAutoplay,
                onDrag: function () {
                    setActiveIndex(calculateActiveIndex(this.rotation));
                },
                onThrowUpdate: function () {
                    setActiveIndex(calculateActiveIndex(this.rotation));
                },
                onThrowComplete: startAutoplay
            })[0]; // Draggable.create returns an array, we take the first instance
        }

        // Cleanup function for Draggable instance and autoplay tween
        return () => {
            if (draggableInstanceRef.current) {
                draggableInstanceRef.current.kill();
                draggableInstanceRef.current = null;
            }
            if (rotationTweenRef.current) {
                rotationTweenRef.current.kill();
                rotationTweenRef.current = null;
            }
            // Clear props on all boxes and container during unmount
            gsap.set(boxes, { clearProps: "all" });
            if (containerRef.current) {
                gsap.set(containerRef.current, { clearProps: "rotation" });
            }
        };
    }, [containerRef, totalSlides, step, calculateActiveIndex, startAutoplay, stopAutoplay]); // Dependencies

    return { activeIndex, startAutoplay, stopAutoplay, draggableInstance: draggableInstanceRef.current };
};