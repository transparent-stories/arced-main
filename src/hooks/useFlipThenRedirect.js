// src/hooks/useFlipThenRedirect.js
import { useCallback } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation'; // Correct import for Next.js App Router

export const useFlipThenRedirect = (boxRefs, innerBoxRefs, draggableInstance, stopAutoplay) => {
    const router = useRouter();

    const flipAndRedirect = useCallback((index, targetPath) => {
        stopAutoplay();
        if (draggableInstance) {
            draggableInstance.disable(); // Disable draggable during animation
        }

        const clickedBox = boxRefs.current[index];
        const clickedInner = innerBoxRefs.current[index];
        if (!clickedBox || !clickedInner) return;

        // Calculate target position and scale to fill viewport
        const rect = clickedBox.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const translateX = viewportCenterX - (rect.left + rect.width / 2);
        const translateY = viewportCenterY - (rect.top + rect.height / 2);

        // Adjust targetScale calculation for a more robust fill, capping at 3x
        const targetScaleX = (window.innerWidth * 0.9) / rect.width;
        const targetScaleY = (window.innerHeight * 0.9) / rect.height;
        const targetScale = Math.min(targetScaleX, targetScaleY, 3); // Cap scale to prevent absurdly large values for very small boxes

        gsap.timeline({
            onStart: () => {
                document.body.style.overflow = 'hidden'; // Hide scrollbar during animation
                // Make sure other boxes are not visible during the expansion
                gsap.to(
                    boxRefs.current.filter((_, i) => i !== index),
                    { opacity: 0, duration: 0.3, pointerEvents: 'none' }
                );
            },
            onComplete: () => {
                // IMPORTANT: Ensure the navigation happens *after* the animation
                router.push(targetPath);
                // Optionally reset overflow if you were to return to this page
                // document.body.style.overflow = '';
            }
        })
            .to(clickedBox, {
                duration: 0.8,
                x: translateX,
                y: translateY,
                scale: targetScale,
                zIndex: 9999, // Ensure it's on top during animation
                ease: "power2.inOut",
                overwrite: "all"
            }, 0) // Start this animation at the beginning of the timeline
            .to(clickedInner, {
                duration: 0.8,
                rotationX: 180, // Flip to the back
                ease: "power2.inOut",
                overwrite: "all"
            }, 0); // Start this animation at the beginning of the timeline
    }, [boxRefs, innerBoxRefs, draggableInstance, router, stopAutoplay]);

    return { flipAndRedirect };
};