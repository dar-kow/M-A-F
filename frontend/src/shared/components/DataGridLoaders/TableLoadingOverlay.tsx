import React, { useState, useEffect } from 'react';
import { Box, LinearProgress, useTheme } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

/**
 * Komponent nakładki ładowania dla DataGrid z eleganckim paskiem postępu
 * @returns JSX.Element - Komponent nakładki ładowania
 */
export const TableLoadingOverlay: React.FC = () => {
    const [, setCounter] = useState(0);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prev) => (prev < 100 ? prev + 1 : 0));
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <GridOverlay
            sx={{
                zIndex: 9999,
                backgroundColor: isDarkMode 
                    ? 'rgba(0, 0, 0, 0.75)' 
                    : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(2px)'
            }}
        >
            {/* Pasek ładowania pod nagłówkami - dostosowany do motywu */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    zIndex: 10000,
                    backgroundColor: isDarkMode
                        ? 'rgba(66, 165, 245, 0.1)'
                        : '#bbdefb',
                }}
            >
                <LinearProgress
                    color="primary"
                    variant="indeterminate"
                    sx={{
                        height: '100%',
                        '.MuiLinearProgress-bar': {
                            backgroundColor: isDarkMode 
                                ? '#42a5f5' 
                                : '#1976d2',
                        },
                        '.MuiLinearProgress-bar1Indeterminate': {
                            backgroundColor: isDarkMode 
                                ? '#42a5f5' 
                                : '#1976d2',
                        },
                        '.MuiLinearProgress-bar2Indeterminate': {
                            backgroundColor: isDarkMode 
                                ? '#6cb8e6' 
                                : '#42a5f5',
                        }
                    }}
                />
            </Box>

            {/* Style dla animacji */}
            <style>{`
                @keyframes moveGradient {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
            `}</style>
        </GridOverlay>
    );
};

export default TableLoadingOverlay;
