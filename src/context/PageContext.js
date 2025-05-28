'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFromApi } from '../utils/api';

const PageContext = createContext();

export const PageProvider = ({ children }) => {
    const [queryParams, setQueryParams] = useState({});
    const { id, ...otherParams } = queryParams

    const { data: pageData, isLoading, error, refetch } = useQuery({
        queryKey: ['singlePage', queryParams],
        queryFn: () => fetchFromApi(`/pages/${id}`, otherParams, "wp"),
        enabled: !!id, // Fetch only if ID is provided
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <PageContext.Provider
            value={{
                pageData,
                isLoading,
                error,
                refetch,
                setQueryParams,
            }}
        >
            {children}
        </PageContext.Provider>
    );
};

export const usePages = () => useContext(PageContext);
