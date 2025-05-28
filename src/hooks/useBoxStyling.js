// src/hooks/useBoxStyling.js
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useBoxStyling = (boxRefs, activeIndex, boxImages) => { // Added boxImages parameter

    // Effect to apply active/inactive styles and manage hover animations
    useEffect(() => {
        // Define common animation properties for active/inactive/hover states
        const activeProps = {
            opacity: 1,
            zIndex: 10,
            scale: 1.2,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
            // Set filter to none for active box (full color)
            filter: 'grayscale(0%)',
            // Ensure text is readable over the image
            color: '#fff', // White text
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)', // Optional: for better contrast
        };
        const inactiveProps = {
            opacity: 0.9,
            zIndex: 1,
            scale: 1,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            // Set filter to grayscale for inactive boxes
            filter: 'grayscale(100%)',
            // Ensure text is readable over the image
            color: '#eee', // Lighter gray text for grayscale images
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
        };
        const activeHoverProps = {
            scale: 1.25, // Slightly larger than activeScale
            boxShadow: '0 12px 24px rgb(24, 33, 108, 0.6)', // More pronounced shadow
            cursor: "pointer",
        };
        const inactiveHoverProps = {
            scale: 1.05, // Slightly larger than inactiveScale
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)', // Slightly more pronounced shadow
            cursor: "pointer",
        };

        const boxes = boxRefs.current;

        // Cleanup function for event listeners to prevent memory leaks and duplicate listeners
        const cleanupHoverListeners = () => {
            boxes.forEach(box => {
                if (box) {
                    if (box._mouseEnterHandler) {
                        box.removeEventListener('mouseenter', box._mouseEnterHandler);
                        box._mouseEnterHandler = null;
                    }
                    if (box._mouseLeaveHandler) {
                        box.removeEventListener('mouseleave', box._mouseLeaveHandler);
                        box._mouseLeaveHandler = null;
                    }
                    gsap.set(box, { cursor: 'default' }); // Ensure cursor is reset
                }
            });
        };

        // Call cleanup initially and on re-renders to remove old listeners
        cleanupHoverListeners();

        boxes.forEach((box, i) => {
            if (!box) return;

            // Set the background image once when the component mounts/updates
            // This is done using GSAP's .set() for consistency
            gsap.set(box, {
                backgroundImage: `url(${boxImages[i]})`, // Set the specific image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            });

            // Apply base active/inactive styles
            if (i === activeIndex) {
                gsap.to(box, {
                    duration: 0.4,
                    ...activeProps,
                    ease: "back.out(1.7)",
                    overwrite: "all" // Important: overwrites any ongoing tweens
                });
            } else {
                gsap.to(box, {
                    duration: 0.4,
                    ...inactiveProps,
                    ease: "power2.out",
                    overwrite: "all" // Important: overwrites any ongoing tweens
                });
            }

            // Attach hover event listeners
            const handleMouseEnter = () => {
                gsap.to(box, {
                    duration: 0.2, // Faster hover-in for responsiveness
                    ...(i === activeIndex ? activeHoverProps : inactiveHoverProps),
                    ease: "power1.out",
                    overwrite: "all"
                });
            };

            const handleMouseLeave = () => {
                // Revert to non-hover state based on whether it's active or inactive
                gsap.to(box, {
                    duration: 0.3, // Slower hover-out for a smoother transition
                    ...(i === activeIndex ? activeProps : inactiveProps),
                    cursor: "default", // Revert cursor
                    ease: "power1.out",
                    overwrite: "all"
                });
            };

            // Store handlers directly on the DOM element for reliable removal later
            box._mouseEnterHandler = handleMouseEnter;
            box._mouseLeaveHandler = handleMouseLeave;

            box.addEventListener('mouseenter', box._mouseEnterHandler);
            box.addEventListener('mouseleave', box._mouseLeaveHandler);
        });

        // Return cleanup function to remove event listeners on unmount or effect re-run
        return cleanupHoverListeners;

    }, [activeIndex, boxRefs, boxImages]); // Added boxImages to dependencies

    // No return values are needed from this hook as it only applies side effects (animations/styling)
};