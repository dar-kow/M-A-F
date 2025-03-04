import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment, Paper, ClickAwayListener } from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import { GridColumnHeaderParams } from '@mui/x-data-grid';
import ReactDOM from 'react-dom';

interface InvoiceFilterHeaderProps {
    params: GridColumnHeaderParams;
    placeholder: string;
    value: string;
    onChange: (field: string, value: string) => void;
    onClear: (field: string) => void;
    isActive?: boolean;
}

const InvoiceFilterHeader = ({
    params,
    placeholder,
    value,
    onChange,
    onClear,
    isActive = false
}: InvoiceFilterHeaderProps) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    // Stan dla tooltipa i popera
    const [showTooltip, setShowTooltip] = useState(true);
    const [tooltipEnabled, setTooltipEnabled] = useState(true);
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    // Stan pozycjonowania tooltipa i popera
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0, width: 0 });

    // Gdy filtr jest aktywny (ma wartość), pokazujemy nagłówek w trybie filtrowania
    const isFilterActive = value && value.length > 0;

    // Inicjalizacja stanu filterOpen na podstawie wartości filtra
    useEffect(() => {
        if (isFilterActive && !filterOpen) {
            setFilterOpen(true);
            setShowTooltip(false);
            setTooltipEnabled(false);
        } else if (!isFilterActive && filterOpen) {
            setFilterOpen(false);
            setShowTooltip(false);
        }
    }, [isFilterActive, filterOpen]);

    // Nasłuchiwanie prawego kliknięcia na poziomie dokumentu
    useEffect(() => {
        // Tylko dodajemy, gdy popup jest otwarty
        if (!showFilterPopup) return;

        // Usunięto nieużywany parametr e z tej funkcji
        const handleGlobalContextMenu = () => {
            // Jeśli poper jest otwarty, zamykamy go
            if (showFilterPopup) {
                handleCloseFilterPopup();
            }
        };

        document.addEventListener('contextmenu', handleGlobalContextMenu);

        return () => {
            document.removeEventListener('contextmenu', handleGlobalContextMenu);
        };
    }, [showFilterPopup]);

    // Aktualizacja lokalnej wartości gdy zmienia się wartość z props
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Funkcja do obliczania pozycji tooltipa
    const calculateTooltipPosition = () => {
        if (headerRef.current) {
            const rect = headerRef.current.getBoundingClientRect();
            setTooltipPosition({
                top: rect.top - 30,
                left: rect.left + rect.width / 2
            });
        }
    };

    // Funkcja do obliczania pozycji popera filtra
    const calculateFilterPosition = () => {
        if (headerRef.current) {
            const rect = headerRef.current.getBoundingClientRect();
            setFilterPosition({
                top: rect.top - 50,
                left: rect.left + rect.width / 2,
                width: Math.max(rect.width * 1.5, 240)
            });
        }
    };

    // Obsługa hovera na nagłówku - POPRAWIONE
    const handleHeaderMouseEnter = () => {
        if (!filterOpen && tooltipEnabled) {
            setIsHeaderHovered(true);
            calculateTooltipPosition();
            setShowTooltip(true);
        }
    };

    const handleHeaderMouseLeave = () => {
        setIsHeaderHovered(false);
        setShowTooltip(false);
    };

    // Obsługa kliknięcia prawym przyciskiem myszy - aktywacja filtrowania
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        handleOpenFilterPopup();
    };

    // Otwieranie popupa do filtrowania
    const handleOpenFilterPopup = () => {
        calculateFilterPosition();
        setShowFilterPopup(true);
        setShowTooltip(false);
        setTooltipEnabled(false); // Wyłączamy tooltip na czas popera
    };

    // Zamykanie popupa z filtrem - POPRAWIONE
    const handleCloseFilterPopup = () => {
        setShowFilterPopup(false);

        // Po zamknięciu popera, z opóźnieniem włączamy ponownie tooltip
        setTimeout(() => {
            setTooltipEnabled(true);
        }, 500);
    };

    // Czyszczenie filtra - POPRAWIONE
    const handleClearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClear(params.field);
        setLocalValue('');
        setFilterOpen(false);
        setShowFilterPopup(false);

        // Włączamy tooltip z opóźnieniem
        setTooltipEnabled(false);
        setTimeout(() => {
            setTooltipEnabled(true);
        }, 500);
    };

    // Zatwierdzenie filtra - POPRAWIONE
    const handleApplyFilter = () => {
        onChange(params.field, localValue);
        setShowFilterPopup(false);

        if (localValue) {
            setFilterOpen(true);
            setTooltipEnabled(false); // Wyłączamy tooltip na stałe gdy filtr jest aktywny
        } else {
            setFilterOpen(false);
            // Włączamy tooltip z opóźnieniem
            setTimeout(() => {
                setTooltipEnabled(true);
            }, 500);
        }
    };

    // Efekt czyszczenia timera przy odmontowaniu
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Hook sprawdzający czy filtr powinien zostać zamknięty na podstawie isActive
    useEffect(() => {
        if (!isActive && showFilterPopup) {
            setShowFilterPopup(false);

            // Włączamy tooltip z opóźnieniem po zamknięciu przez ClickAway
            setTimeout(() => {
                setTooltipEnabled(true);
            }, 500);
        }
    }, [isActive]);

    // Renderowanie tooltipa za pomocą portalu - POPRAWIONE
    const renderTooltip = () => {
        // Pokazujemy tooltip tylko gdy wszystkie warunki są spełnione
        if (!showTooltip || !isHeaderHovered || filterOpen || showFilterPopup || !tooltipEnabled) {
            return null;
        }

        return ReactDOM.createPortal(
            <div
                style={{
                    position: 'fixed',
                    zIndex: 10010,
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(97, 97, 97, 0.92)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
            >
                <FilterIcon style={{ fontSize: '16px' }} />
                Prawy klik - Filtruj
            </div>,
            document.body
        );
    };

    // Renderowanie popupa z filtrem za pomocą portalu
    const renderFilterPopup = () => {
        if (!showFilterPopup) return null;

        return ReactDOM.createPortal(
            <ClickAwayListener
                onClickAway={handleCloseFilterPopup}
                mouseEvent="onMouseDown" // Reagujemy na każdy rodzaj kliknięcia
            >
                <Paper
                    elevation={5}
                    style={{
                        position: 'fixed',
                        zIndex: 10010,
                        top: `${filterPosition.top}px`,
                        left: `${filterPosition.left}px`,
                        transform: 'translateX(-50%)',
                        width: `${filterPosition.width}px`,
                        padding: '8px',
                        maxWidth: '90vw'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={placeholder}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        autoFocus
                        fullWidth
                        label={`Filtruj: ${params.colDef.headerName}`}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: localValue ? 'primary.main' : 'rgba(0, 0, 0, 0.23)' },
                                '&:hover fieldset': { borderColor: localValue ? 'primary.main' : 'rgba(0, 0, 0, 0.23)' }
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {localValue && (
                                            <IconButton
                                                aria-label="wyczyść filtr"
                                                onClick={handleClearFilter}
                                                edge="end"
                                                size="small"
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            aria-label="zastosuj filtr"
                                            onClick={handleApplyFilter}
                                            edge="end"
                                            size="small"
                                            color="primary"
                                        >
                                            <FilterIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </InputAdornment>
                            )
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleApplyFilter();
                            }
                        }}
                    />
                </Paper>
            </ClickAwayListener>,
            document.body
        );
    };

    return (
        <>
            {/* Główny kontener nagłówka */}
            <Box
                ref={headerRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: '6px 4px 4px 8px', // tutaj zrób miejsce na ikonkę do sortowania żeby nie uciakała jak szalona
                    position: 'relative',
                    overflow: 'visible' // Pozwala na przelewanie się zawartości
                }}
                onMouseEnter={handleHeaderMouseEnter}
                onMouseLeave={handleHeaderMouseLeave}
                onContextMenu={handleContextMenu}
            >
                {filterOpen ? (
                    // Tryb filtrowania - pokazuje pole input
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder={placeholder}
                        value={value}
                        onClick={(e) => {
                            handleOpenFilterPopup();
                            e.stopPropagation();
                        }}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear filter"
                                        onClick={handleClearFilter}
                                        edge="end"
                                        size="small"
                                    >
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        label={params.colDef.headerName}
                        className="column-filter-input"
                        sx={{
                            width: '100%',
                            maxWidth: '90%',
                            '& .MuiInputBase-root': {
                                width: '100%',
                                maxWidth: '100%',
                                overflow: 'hidden',
                            },
                            '& .MuiInputLabel-root': {
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                            '& .MuiOutlinedInput-input': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                            '& .MuiOutlinedInput-root': {
                                cursor: 'pointer',
                                width: '100%',
                                maxWidth: '100%',
                                '& fieldset': {
                                    borderColor: isFilterActive ? 'primary.main' : 'rgba(0, 0, 0, 0.23)'
                                },
                                '&:hover fieldset': {
                                    borderColor: isFilterActive ? 'primary.main' : 'rgba(0, 0, 0, 0.23)'
                                }
                            }
                        }}
                    />
                ) : (
                    // Tryb nagłówka - pokazuje nazwę kolumny 
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        position: 'relative',
                        minHeight: '24px'
                    }}>
                        <Typography
                            variant="subtitle2"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                color: isFilterActive ? 'primary.main' : 'inherit',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {params.colDef.headerName}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Renderowanie tooltipa i popupa przez portal */}
            {renderTooltip()}
            {renderFilterPopup()}
        </>
    );
};

export default InvoiceFilterHeader;