import { useState, useEffect } from 'react';
import { GridColumnVisibilityModel } from '@mui/x-data-grid';

interface UseColumnManagementProps {
    visibilityKey: string;
    orderKey: string;
}

/**
 * Hook do zarządzania widocznością i kolejnością kolumn
 */
export function useColumnManagement({ visibilityKey, orderKey }: UseColumnManagementProps) {
    // Stan dla modelu widoczności kolumn
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(() => {
        try {
            const saved = localStorage.getItem(visibilityKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Błąd odczytu ustawień widoczności kolumn:', e);
            return {};
        }
    });

    // Stan dla kolejności kolumn
    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(orderKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Błąd odczytu kolejności kolumn:', e);
        }
        return [];
    });

    // Zapisywanie ustawień kolumn do localStorage
    useEffect(() => {
        const saveVisibility = () => {
            try {
                localStorage.setItem(visibilityKey, JSON.stringify(columnVisibilityModel));
            } catch (e) {
                console.error('Błąd zapisu ustawień widoczności kolumn:', e);
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(saveVisibility);
        } else {
            setTimeout(saveVisibility, 300);
        }
    }, [columnVisibilityModel, visibilityKey]);

    // Zapisywanie kolejności kolumn
    useEffect(() => {
        if (columnOrder && columnOrder.length > 0) {
            const saveOrder = () => {
                try {
                    localStorage.setItem(orderKey, JSON.stringify(columnOrder));
                } catch (e) {
                    console.error('Błąd zapisu kolejności kolumn:', e);
                }
            };

            if (window.requestIdleCallback) {
                window.requestIdleCallback(saveOrder);
            } else {
                setTimeout(saveOrder, 300);
            }
        }
    }, [columnOrder, orderKey]);

    // Reset ustawień kolumn
    const handleResetColumns = () => {
        setColumnVisibilityModel({});
        setColumnOrder([]);
        localStorage.removeItem(visibilityKey);
        localStorage.removeItem(orderKey);
    };

    return {
        columnVisibilityModel,
        setColumnVisibilityModel,
        columnOrder,
        setColumnOrder,
        handleResetColumns
    };
}