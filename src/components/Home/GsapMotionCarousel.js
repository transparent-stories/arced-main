// components/GsapMotionCarousel.js
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import styles from "../../app/GsapMotionCarousel.module.css";

export default function GsapMotionCarousel() {
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const tracker = useRef({ item: 0 });

    useEffect(() => {
        gsap.registerPlugin(MotionPathPlugin);

        const items = itemsRef.current;
        const circlePath = MotionPathPlugin.convertToPath(svgRef.current.querySelector("#holder"), false)[0];
        circlePath.id = "circlePath";
        svgRef.current.prepend(circlePath);

        const numItems = items.length;
        const itemStep = 1 / numItems;
        const wrapProgress = gsap.utils.wrap(0, 1);
        const snap = gsap.utils.snap(itemStep);
        const wrapTracker = gsap.utils.wrap(0, numItems);

        gsap.set(items, {
            motionPath: {
                path: circlePath,
                align: circlePath,
                alignOrigin: [0.5, 0.5],
                end: (i) => i / items.length,
            },
            scale: 0.9,
        });

        const tl = gsap.timeline({ paused: true, reversed: true });

        tl.to(wrapperRef.current, {
            rotation: 360,
            transformOrigin: "center",
            duration: 1,
            ease: "none",
        });

        tl.to(
            items,
            {
                rotation: "-=360",
                transformOrigin: "center center",
                duration: 1,
                ease: "none",
            },
            0
        );

        tl.to(
            tracker.current,
            {
                item: numItems,
                duration: 1,
                ease: "none",
                modifiers: {
                    item: (value) => wrapTracker(numItems - Math.round(value)),
                },
            },
            0
        );

        const moveWheel = (amount) => {
            const progress = tl.progress();
            tl.progress(wrapProgress(snap(tl.progress() + amount)));
            const next = tracker.current.item;
            tl.progress(progress);

            document.querySelector("." + styles.active).classList.remove(styles.active);
            items[next].classList.add(styles.active);

            gsap.to(tl, {
                progress: snap(tl.progress() + amount),
                modifiers: { progress: wrapProgress },
            });
        };

        document.getElementById("nextBtn").addEventListener("click", () => moveWheel(-itemStep));
        document.getElementById("prevBtn").addEventListener("click", () => moveWheel(itemStep));

        return () => {
            document.getElementById("nextBtn")?.removeEventListener("click", () => moveWheel(-itemStep));
            document.getElementById("prevBtn")?.removeEventListener("click", () => moveWheel(itemStep));
        };
    }, []);

    return (
        <>
            <div className={styles.container} ref={containerRef}>
                <div className={styles.wrapper} ref={wrapperRef}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.item} ${i === 0 ? styles.active : ""}`}
                            ref={(el) => (itemsRef.current[i] = el)}
                        >
                            {i + 1}
                        </div>
                    ))}
                    <svg viewBox="0 0 300 300" ref={svgRef}>
                        <circle id="holder" className={styles.st0} cx="151" cy="151" r="150" />
                    </svg>
                </div>
                <div className={styles.start}>&larr; Active</div>
            </div>
            <div className={styles.controls}>
                <button id="prevBtn">Prev</button>
                <button id="nextBtn">Next</button>
            </div>
        </>
    );
}
