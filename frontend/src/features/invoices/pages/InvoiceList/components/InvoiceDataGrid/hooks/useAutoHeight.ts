import { useState, useCallback, useEffect } from 'react';

interface UseAutoHeightProps {
    autoHeight: boolean;
    defaultHeight: number;
    containerRef: React.RefObject<HTMLElement> | undefined;
    wrapperRef: React.RefObject<HTMLDivElement>;
    headerOffset?: number;
}

/**
 * Hook do automatycznego dostosowywania wysokości
 */
export function useAutoHeight({
    autoHeight,
    defaultHeight,
    containerRef,
    wrapperRef,
    headerOffset = 90
}: UseAutoHeightProps) {
    const [calculatedHeight, setCalculatedHeight] = useState<number>(defaultHeight);

    const calculateHeight = useCallback(() => {
        if (!autoHeight || !containerRef?.current) {
            return;
        }

        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const gridWrapperTop = wrapperRef.current?.getBoundingClientRect().top || containerTop;

        // Obliczamy dostępną wysokość (okno - pozycja kontenera - offset)
        const availableHeight = windowHeight - gridWrapperTop - headerOffset;
        const newHeight = Math.max(defaultHeight, availableHeight); // Minimum to domyślna wysokość

        setCalculatedHeight(newHeight);
    }, [autoHeight, containerRef, wrapperRef, headerOffset, defaultHeight]);

    useEffect(() => {
        if (!autoHeight) {
            return;
        }

        calculateHeight();

        const observer = new ResizeObserver(() => {
            calculateHeight();
        });

        if (containerRef?.current) {
            observer.observe(containerRef.current);
        }

        window.addEventListener('resize', calculateHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateHeight);
        };
    }, [autoHeight, calculateHeight, containerRef]);

    return calculatedHeight;
}