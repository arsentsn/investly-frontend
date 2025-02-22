import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCryptoFullName } from './CryptoNameConverter';

const PriceContext = createContext();

export function PriceProvider({ children }) {
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState({});

    const fetchPrices = useCallback(async (assets) => {
        if (!assets || assets.length === 0) return;

        const now = Date.now();
        const CACHE_DURATION = 60000; // 1 minute cache

        // Filter out assets that were recently fetched
        const assetsToFetch = assets.filter(asset => {
            const lastFetchTime = lastFetch[asset] || 0;
            return now - lastFetchTime > CACHE_DURATION;
        });

        if (assetsToFetch.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const ids = assetsToFetch
                .map(asset => getCryptoFullName(asset))
                .filter(Boolean)
                .join(',');

            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch prices');
            }

            const data = await response.json();

            setPrices(prev => ({
                ...prev,
                ...data
            }));

            // Update last fetch time for fetched assets
            setLastFetch(prev => {
                const updates = {};
                assetsToFetch.forEach(asset => {
                    updates[asset] = now;
                });
                return { ...prev, ...updates };
            });
        } catch (err) {
            console.error('Error fetching prices:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <PriceContext.Provider value={{ prices, loading, error, fetchPrices }}>
            {children}
        </PriceContext.Provider>
    );
}

export function usePrices() {
    const context = useContext(PriceContext);
    if (!context) {
        throw new Error('usePrices must be used within a PriceProvider');
    }
    return context;
}