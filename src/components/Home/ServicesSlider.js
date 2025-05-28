'use client'

import React, { useState, useEffect, useRef } from 'react'
import styles from "../../app/GsapMotionCarousel.module.css";

const TOTAL_SLIDES = 8
const AUTOPLAY_INTERVAL = 2500 // ms

export default function ServicesSlider() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [angle, setAngle] = useState(0) // rotation of pagination ring
    const autoplayRef = useRef(null)

    const step = -360 / TOTAL_SLIDES // degrees per dot

    // Rotate pagination ring on activeIndex change
    useEffect(() => {
        setAngle((prev) => {
            const nextAngle = step * activeIndex
            let diff = nextAngle - prev
            const half = 180
            if (diff > half) diff -= 360
            else if (diff < -half) diff += 360
            return prev + diff
        })
    }, [activeIndex])

    // Autoplay
    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            setActiveIndex((i) => (i + 1) % TOTAL_SLIDES)
        }, AUTOPLAY_INTERVAL)
        return () => clearInterval(autoplayRef.current)
    }, [])

    // Pause autoplay on hover
    function pauseAutoplay() {
        clearInterval(autoplayRef.current)
    }
    function resumeAutoplay() {
        autoplayRef.current = setInterval(() => {
            setActiveIndex((i) => (i + 1) % TOTAL_SLIDES)
        }, AUTOPLAY_INTERVAL)
    }

    // Dot styles
    function getDotStyle(i) {
        const rotation = (360 / TOTAL_SLIDES) * i
        const isActive = i === activeIndex
        return {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: isActive ? '#fff' : 'black',
            color: isActive ? 'black' : 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `rotate(${rotation}deg) translate(0, -190px) rotate(-${rotation}deg)`,
            cursor: 'pointer',
            userSelect: 'none',
            fontWeight: isActive ? '700' : '400',
            transition: 'background-color 0.3s, color 0.3s',
            boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.8)' : 'none',
            fontSize: 14,
        }
    }

    return (
        <div
            onMouseEnter={pauseAutoplay}
            onMouseLeave={resumeAutoplay}
            style={{
                maxWidth: 600,
                margin: '0 auto',
                position: 'relative',
                paddingTop: '100%',
                backgroundColor: 'rgba(0,0,0,0.3)',
                fontFamily: 'Arial, sans-serif',
                color: 'white',
                userSelect: 'none',
            }}
        >
            {/* Slides */}
            <div
                className="slides"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            >
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <div
                        key={i}
                        className={`slide ${activeIndex === i ? 'active' : ''}`}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,0,0,0.3)',
                            opacity: activeIndex === i ? 1 : 0,
                            zIndex: activeIndex === i ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                            fontSize: 24,
                            fontWeight: 'bold',
                        }}
                    >
                        <h2>Slide {i + 1}</h2>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div
                className="pagination"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    border: '3px solid white',
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    transition: 'transform 0.3s ease-out',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 10,
                }}
            >
                {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                    <div
                        key={i}
                        className={`item ${activeIndex === i ? 'active' : ''}`}
                        style={getDotStyle(i)}
                        onClick={() => setActiveIndex(i)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Go to slide ${i + 1}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setActiveIndex(i)
                        }}
                        pointerEvents="auto"
                    >
                        <span>{i + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
