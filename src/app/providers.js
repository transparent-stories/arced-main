'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { PageProvider } from '@/context/PageContext';
import { useEffect } from 'react';

const queryClient = new QueryClient();

export default function Providers({ children }) {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            {/* <PageProvider> */}
            {children}
            {/* </PageProvider> */}
        </QueryClientProvider>
    );
}
