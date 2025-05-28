'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFromApi } from '../utils/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [queryParams, setQueryParams] = useState({ status: 'publish' });

    const { data: allProducts, isLoading, error, refetch } = useQuery({
        queryKey: ['allProducts', queryParams],
        queryFn: () => fetchFromApi('/products', queryParams, 'wc'),
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <ProductContext.Provider
            value={{
                allProducts,
                isLoading,
                error,
                refetch,
                setQueryParams
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
