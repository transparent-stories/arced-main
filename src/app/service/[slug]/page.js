import Footer from '@/components/Global/Footer'
import React from 'react'

const page = async ({ params }) => {
    const { slug } = await params;

    // Map slug to background color codes
    const bgColorMap = {
        activations: '#ef4444', // red-500
        retail: '#22c55e',      // green-500
        content: '#3b82f6',     // blue-500
        event: '#a855f7',       // purple-500
        design: '#eab308',      // yellow-500
    };

    // Fallback color if slug doesn't match
    const backgroundColor = bgColorMap[slug] || '#6b7280'; // gray-500

    return (
        <>
            <div
                style={{
                    backgroundColor,
                    color: 'white',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                data-aos="flip-up"
                data-aos-duration="2000"
            >
                <h1 style={{ fontSize: '1.875rem', textTransform: 'capitalize' }}>{slug} page</h1>
            </div>
            <Footer />
        </>
    )
}

export default page;
