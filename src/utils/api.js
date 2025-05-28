import axios from 'axios';

const apiWP = axios.create({
    baseURL: process.env.NEXT_PUBLIC_WP_API_BASE_URL,
    params: {
        consumer_key: process.env.NEXT_PUBLIC_WP_CONSUMER_KEY,
        consumer_secret: process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET,
    },
    timeout: 10000, // 10 seconds timeout
});

const apiWC = axios.create({
    baseURL: process.env.WC_API_BASE_URL,
    params: {
        consumer_key: process.env.NEXT_PUBLIC_WP_CONSUMER_KEY,
        consumer_secret: process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET,
    },
    timeout: 10000, // 10 seconds timeout
});

export const fetchFromApi = async (endpoint, params = {}, version = "wc") => {
    let apiUrl = `/api/products`; // This will trigger the correct API route in Next.js

    try {
        const { data } = await axios.get(apiUrl, { params });
        return data;
    } catch (error) {
        console.error(`[fetchFromApi] Error fetching from ${apiUrl}:`, error.message);
        throw new Error("Error fetching data from API.");
    }
};


export const fetchFromApiWp = async (endpoint, params = {}, version = "wc") => {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_WP_API_BASE_URL) {
        console.error("API base URLs are not defined in environment variables.");
        throw new Error("API base URL is missing.");
    }

    const api = apiWP;

    try {
        const { data, headers } = await api.get(endpoint, { params });

        const totalRecords = headers?.['x-wp-total'] || '0';
        const totalPages = headers?.['x-wp-totalpages'] || '1';

        const completeData = {
            data,
            headers: {
                totalRecords,
                totalPages
            }
        };
        return completeData;
    } catch (error) {
        console.error(`[fetchFromApi] Error fetching from ${endpoint}`, error.message);
        throw new Error("Error fetching data from API.");
    }
};

export const fetchFromApiWc = async (endpoint, params = {}, version = "wc") => {
    // Validate environment variables
    if (!process.env.WC_API_BASE_URL && !process.env.NEXT_PUBLIC_WP_API_BASE_URL) {
        console.error("API base URLs are not defined in environment variables.");
        throw new Error("API base URL is missing.");
    }

    const api = apiWC;

    try {
        const { data } = await api.get(endpoint, { params });
        return data;
    } catch (error) {
        console.error(`[fetchFromApi] Error fetching from ${endpoint}`, error.message);
        throw new Error("Error fetching data from API.");
    }
};