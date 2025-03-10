import { useState, useCallback } from 'react';

/**
 * Hook do zarządzania filtrami kolumn
 */
export function useColumnFilters() {
    const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
    const [activeFilterField, setActiveFilterField] = useState<string | null>(null);

    const handleColumnFilterChange = useCallback((field: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setActiveFilterField(field);
    }, []);

    const clearColumnFilter = useCallback((field: string) => {
        setColumnFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
        });
    }, []);

    const handleClickAwayFilter = useCallback(() => {
        setActiveFilterField(null);
    }, []);

    return {
        columnFilters,
        activeFilterField,
        handleColumnFilterChange,
        clearColumnFilter,
        handleClickAwayFilter
    };
}