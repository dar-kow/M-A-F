import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, InputAdornment, Paper, ClickAwayListener } from '@mui/material';
import { FilterList as FilterIcon, Clear as ClearIcon } from '@mui/icons-material';
import { GridColumnHeaderParams } from '@mui/x-data-grid';
import ReactDOM from 'react-dom';
import './FilterHeaderStyles.scss'; // Importujemy nowy plik ze stylami

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
            <div
                ref={headerRef}
                className="header-container"
                onMouseEnter={handleHeaderMouseEnter}
                onMouseLeave={handleHeaderMouseLeave}
                onContextMenu={handleContextMenu}
            >
                {/* Główny wiersz z nazwą kolumny - bez zmian oprócz koloru */}
                <div className="header-main-row">
                    <Typography
                        variant="subtitle2"
                        component="div"
                        className="header-title"
                        sx={{
                            color: isFilterActive ? 'primary.main' : 'inherit',
                        }}
                    >
                        {params.colDef.headerName}
                    </Typography>
                </div>

                {/* Wiersz z wartością filtra - tylko gdy filtr jest aktywny */}
                {isFilterActive && (
                    <div
                        className="filter-value-row"
                        onClick={(e) => {
                            handleOpenFilterPopup();
                            e.stopPropagation();
                        }}
                    >
                        <div className="filter-value-container">
                            <FilterIcon className="mini-filter-icon" />
                            <div className="filter-value">
                                {value || placeholder}
                            </div>
                        </div>

                        <IconButton
                            aria-label="usuń filtr"
                            onClick={handleClearFilter}
                            size="small"
                            className="clear-filter-btn"
                        >
                            <ClearIcon />
                        </IconButton>
                    </div>
                )}
            </div>

            {/* Renderowanie tooltipa i popupa */}
            {renderTooltip()}
            {renderFilterPopup()}
        </>
    );
};

export default InvoiceFilterHeader;