'use client';
import Footer from '@/components/Global/Footer';
import HeaderOpaque from '@/components/Global/HeaderOpaque';
import React, { useEffect, useState } from 'react';

const Testing = () => {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define your backend API endpoint here
    const API_ENDPOINT = 'https://arced-backend.anonymoustore.com/wp-json/wp/v2/services?per_page=1'; // Example: fetching one WordPress post. Adjust as needed.

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINT);

                if (!response.ok) {
                    // Check for network errors, 4xx, 5xx status codes
                    const errorText = await response.text(); // Get raw response for more detail
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                setApiData(data);
            } catch (err) {
                console.error('API Fetch Error:', err);
                setError(err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            <HeaderOpaque header_text="Contact Us" />
            <section className='py-5 flex flex-col items-center h-[70vh]'>
                <div className='py-5 text-center h-[50vh] flex flex-col gap-10 justify-center'>
                    <h3 className='text-3xl'>API Testing Results</h3>
                    {loading && <p>Loading API data...</p>}
                    {error && (
                        <div className="text-red-500">
                            <p>Error fetching data:</p>
                            <pre className="text-sm overflow-auto max-w-lg mx-auto p-2 bg-gray-100 rounded">
                                {error}
                            </pre>
                            <p className="mt-2">
                                Please check:
                                <ul>
                                    <li>1. Is the API endpoint `{API_ENDPOINT}` correct and active?</li>
                                    <li>2. Are there CORS issues (check browser console)?</li>
                                    <li>3. Is the backend server (on `arced-backend.anonymoustore.com`) fully operational and serving API requests?</li>
                                    <li>4. Your mobile device's network connection.</li>
                                </ul>
                            </p>
                        </div>
                    )}
                    {apiData && (
                        <div>
                            <p className="text-lg mb-2">Data fetched successfully!</p>
                            <pre className="text-sm text-left p-4 rounded-md overflow-auto max-w-lg mx-auto">
                                {JSON.stringify(apiData, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Testing;