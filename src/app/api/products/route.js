import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    // Extract all query parameters from the request URL
    const params = Object.fromEntries(searchParams.entries());

    try {
        // Pass all params (including status, tag, etc.) to the WooCommerce API
        const { data } = await axios.get(`${process.env.WC_API_BASE_URL}/products`, {
            params: {
                ...params,  // Spread the params object to pass all query params dynamically,
                consumer_key: process.env.NEXT_PUBLIC_WP_CONSUMER_KEY,
                consumer_secret: process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET
            },
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${process.env.NEXT_PUBLIC_WP_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_WP_CONSUMER_SECRET}`
                ).toString('base64')}`,
            },
        });

        return NextResponse.json(data);
    } catch (error) {

        console.log(error.message)
        console.error("Error fetching data from WooCommerce:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
