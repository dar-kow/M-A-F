import { useState, useEffect } from 'react';

interface UseDelayedLoadingProps {
    isLoading: boolean;
    dataLength: number;
    initialDelay?: number;
    subsequentDelay?: number;
}

/**
 * Hook do opóźnionego pokazywania danych (dla lepszego UX)
 */
export function useDelayedLoading({
    isLoading,
    dataLength,
    initialDelay = 1000,
    subsequentDelay = 500
}: UseDelayedLoadingProps) {
    const [showData, setShowData] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (isLoading) {
            setShowData(false);
            return;
        }

        const minLoadingTime = isFirstLoad ? initialDelay : subsequentDelay;

        const timer = setTimeout(() => {
            setShowData(true);
            if (isFirstLoad) {
                setIsFirstLoad(false);
            }
        }, minLoadingTime);

        return () => clearTimeout(timer);
    }, [isLoading, isFirstLoad, dataLength, initialDelay, subsequentDelay]);

    return { showData, isDataReady: !isLoading && showData };
}