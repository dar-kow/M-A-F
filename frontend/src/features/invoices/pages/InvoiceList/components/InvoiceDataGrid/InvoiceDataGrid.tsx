import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef, useCallback } from 'react';
import { Paper, ClickAwayListener } from '@mui/material';
import {
    DataGrid,
    GridColumnVisibilityModel,
    useGridApiRef,
    gridClasses
} from '@mui/x-data-grid';
import { plPL } from '@mui/x-data-grid/locales';
import { Invoice, PaymentStatus } from '@app-types/types';
import { formatDate } from '@shared/utils/formatters';
import { getPaymentStatusLabel } from '@shared/utils/statusHelpers';
import InvoiceFilterHeader from '../InvoiceFilterHeader/InvoiceFilterHeader';
import CustomColumnsPanel from './CustomColumnsPanel';
import { getInvoiceColumns } from './InvoiceColumns/InvoiceColumns';
import TableLoadingOverlay from '@shared/components/DataGridLoaders/TableLoadingOverlay';

// Klucze dla localStorage
const COLUMN_VISIBILITY_KEY = 'invoiceGridColumnVisibility';
const COLUMN_ORDER_KEY = 'invoiceGridColumnOrder';

// Interfejs dla ref do zarządzania kolumnami
interface InvoiceDataGridRef {
    openColumnSelector: () => void;
}

interface InvoiceDataGridProps {
    invoices: (Invoice & { contractorName?: string })[];
    isLoading: boolean;
    onEditInvoice: (id: number) => void;
    onDeleteInvoice: (id: number) => void;
    onPreviewInvoice: (invoice: Invoice & { contractorName?: string }) => void;
    height?: number;
    autoHeight?: boolean; // opcja dla automatycznej wysokości
    containerRef?: React.RefObject<HTMLElement>;
    headerOffset?: number;
}

/**
 * Komponent tabeli DataGrid dla faktur z filtrowaniem i akcjami
 */
const InvoiceDataGrid = forwardRef<InvoiceDataGridRef, InvoiceDataGridProps>(({
    invoices,
    isLoading,
    onEditInvoice,
    onDeleteInvoice,
    onPreviewInvoice,
    height,
    autoHeight = false,
    containerRef,
    headerOffset = 90
}, ref) => {
    // Stan filtrów dla poszczególnych kolumn
    const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});
    const [activeFilterField, setActiveFilterField] = useState<string | null>(null);
    const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
    const [showData, setShowData] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [calculatedHeight, setCalculatedHeight] = useState<number>(height || 600);

    const columnMenuButtonRef = useRef<HTMLButtonElement | null>(null);
    const gridWrapperRef = useRef<HTMLDivElement>(null);
    const apiRef = useGridApiRef();

    // Stan dla modelu widoczności kolumn
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(() => {
        try {
            const saved = localStorage.getItem(COLUMN_VISIBILITY_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Błąd odczytu ustawień widoczności kolumn:', e);
            return {};
        }
    });

    // Stan dla kolejności kolumn
    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(COLUMN_ORDER_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Błąd odczytu kolejności kolumn:', e);
        }
        return [];
    });

    // Funkcja obliczająca dostępną wysokość
    const calculateHeight = useCallback(() => {
        if (!autoHeight || !containerRef?.current) {
            return;
        }

        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const gridWrapperTop = gridWrapperRef.current?.getBoundingClientRect().top || containerTop;

        // Obliczamy dostępną wysokość (okno - pozycja kontenera - offset)
        const availableHeight = windowHeight - gridWrapperTop - headerOffset;
        const newHeight = Math.max(600, availableHeight); // Minimum 600px

        setCalculatedHeight(newHeight);
    }, [autoHeight, containerRef, headerOffset]);

    // Używamy ResizeObserver do śledzenia zmian rozmiaru
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

    // Efekt dla kontroli pokazywania danych z opóźnieniem
    useEffect(() => {
        if (isLoading) {
            setShowData(false);
            if (isFirstLoad && !invoices.length) {
                console.log("Pierwsze ładowanie...");
            }
            return;
        }

        const minLoadingTime = isFirstLoad ? 1000 : 500; // ms
        const timer = setTimeout(() => {
            setShowData(true);
            if (isFirstLoad) {
                setIsFirstLoad(false);
            }
        }, minLoadingTime);

        return () => clearTimeout(timer);
    }, [isLoading, isFirstLoad, invoices.length]);

    // Handler otwierania selektora kolumn
    const handleOpenColumnSelector = () => {
        setColumnsMenuOpen(true);
    };

    // Eksponujemy funkcje dla komponentu nadrzędnego przez ref
    useImperativeHandle(ref, () => ({
        openColumnSelector: handleOpenColumnSelector
    }));

    // Zoptymalizowane handlery dla filtrów
    const handleColumnFilterChange = React.useCallback((field: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setActiveFilterField(field);
    }, []);

    const clearColumnFilter = React.useCallback((field: string) => {
        setColumnFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[field];
            return newFilters;
        });
    }, []);

    const handleClickAwayFilter = React.useCallback(() => {
        setActiveFilterField(null);
    }, []);

    // Zapisywanie ustawień kolumn do localStorage
    useEffect(() => {
        const saveVisibility = () => {
            try {
                localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibilityModel));
            } catch (e) {
                console.error('Błąd zapisu ustawień widoczności kolumn:', e);
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(saveVisibility);
        } else {
            setTimeout(saveVisibility, 300);
        }
    }, [columnVisibilityModel]);

    // Zapisywanie kolejności kolumn
    useEffect(() => {
        if (columnOrder && columnOrder.length > 0) {
            const saveOrder = () => {
                try {
                    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnOrder));
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
    }, [columnOrder]);

    // Reset ustawień kolumn
    const handleResetColumns = () => {
        setColumnVisibilityModel({});
        setColumnOrder([]);
        localStorage.removeItem(COLUMN_VISIBILITY_KEY);
        localStorage.removeItem(COLUMN_ORDER_KEY);
    };

    // Optymalizacja filtrowania
    const filteredData = React.useMemo(() => {
        if (Object.keys(columnFilters).length === 0) return invoices;

        return invoices.filter(invoice => {
            return Object.entries(columnFilters).every(([field, filterValue]) => {
                if (!filterValue) return true;

                let value;
                if (field === 'paymentStatus') {
                    value = getPaymentStatusLabel(invoice[field as keyof typeof invoice] as PaymentStatus).toLowerCase();
                } else if (field === 'issueDate' || field === 'dueDate') {
                    value = formatDate(invoice[field as keyof typeof invoice]).toLowerCase();
                } else if (field === 'totalAmount' || field === 'paidAmount') {
                    const amount = Number(invoice[field as keyof typeof invoice] || 0);
                    value = amount.toString().toLowerCase();
                } else {
                    value = String(invoice[field as keyof typeof invoice] || '').toLowerCase();
                }

                return value.includes(filterValue.toLowerCase());
            });
        });
    }, [invoices, columnFilters]);

    // Renderowanie filtrów nagłówków
    const renderFilterHeader = React.useCallback((params: any, placeholder: string) => (
        <ClickAwayListener onClickAway={handleClickAwayFilter}>
            <div>
                <InvoiceFilterHeader
                    params={params}
                    placeholder={placeholder}
                    value={columnFilters[params.field] || ''}
                    onChange={handleColumnFilterChange}
                    onClear={clearColumnFilter}
                    isActive={activeFilterField === params.field}
                />
            </div>
        </ClickAwayListener>
    ), [columnFilters, handleColumnFilterChange, clearColumnFilter, activeFilterField, handleClickAwayFilter]);

    // Kolumny dla tabeli
    const columns = React.useMemo(() =>
        getInvoiceColumns(
            renderFilterHeader,
            onEditInvoice,
            onDeleteInvoice,
            onPreviewInvoice,
            handleOpenColumnSelector,
            columnMenuButtonRef as React.RefObject<HTMLButtonElement>
        ),
        [renderFilterHeader, onEditInvoice, onDeleteInvoice, onPreviewInvoice]);

    // Sortowanie kolumn
    const sortedColumns = React.useMemo(() => {
        if (columnOrder && columnOrder.length > 0) {
            return [...columns].sort((a, b) => {
                const aIndex = columnOrder.indexOf(a.field);
                const bIndex = columnOrder.indexOf(b.field);
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
        }
        return columns;
    }, [columns, columnOrder]);

    // Finalna wysokość do użycia
    const finalHeight = autoHeight ? calculatedHeight : (autoHeight || 600);

    // Renderowanie
    return (
        <Paper
            className="invoice-datagrid"
            ref={gridWrapperRef}
            sx={{
                height: `${finalHeight}px`,
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <DataGrid
                disableExtendRowFullWidth={true}
                disableColumnReorder={true}
                showColumnRightBorder={true}
                showCellVerticalBorder={false}
                rows={showData ? filteredData : []}
                columns={sortedColumns}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                density="standard"
                loading={isLoading || !showData}
                localeText={plPL.components.MuiDataGrid.defaultProps.localeText}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                            page: 0
                        }
                    },
                }}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
                slots={{
                    loadingOverlay: TableLoadingOverlay,
                }}
                disableColumnMenu={true}
                slotProps={{
                    loadingOverlay: {
                        sx: {
                            zIndex: 9999,
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }
                    },
                    virtualScroller: {
                        sx: {
                            overflowX: 'hidden',
                            "&::-webkit-scrollbar": {
                                width: "6px",
                                height: "0",
                            },
                            // Wyraźnie ustawiamy marginBottom na 0
                            marginBottom: 0
                        }
                    },
                    footer: {
                        sx: {
                            // Upewniamy się, że stopka nie ma dolnego marginesu
                            marginBottom: 0,
                            borderTop: '1px solid #e0e0e0',
                            // Usuwamy jakikolwiek padding na dole
                            paddingBottom: 0
                        }
                    }
                }}
                apiRef={apiRef}
                hideFooterSelectedRowCount
                disableVirtualization={false}
                className="invoice-datagrid"
                keepNonExistentRowsSelected
                sx={{
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    '& .MuiDataGrid-main': {
                        overflow: 'auto !important',
                    },
                    '.MuiDataGrid-virtualScroller': {
                        overflow: 'auto !important',
                        // Usuwamy niepotrzebne właściwości transform
                    },
                    '.MuiDataGrid-cell': {
                        overflow: 'hidden',
                    },
                    // Naprawienie pozycjonowania tooltipów i poperów
                    [`.${gridClasses.columnHeader}, .${gridClasses.cell}`]: {
                        position: 'relative',
                        '& .MuiTooltip-popper, & .MuiPopover-root': {
                            zIndex: 10001,
                        },
                        '& .MuiPopover-paper': {
                            transformOrigin: 'top center !important',
                            position: 'absolute !important'
                        }
                    },
                    // Zapewnij, że poper z filtrem jest nad innymi elementami
                    '& .filter-popover': {
                        zIndex: 10001,
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        }
                    },
                    // Upewniamy się, że stopka jest na dole kontenera
                    '.MuiDataGrid-footerContainer': {
                        marginTop: 'auto',
                        paddingBottom: 0,
                        borderTop: '1px solid #e0e0e0',
                    },
                }}
            />

            <CustomColumnsPanel
                open={columnsMenuOpen}
                onClose={() => setColumnsMenuOpen(false)}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                onResetColumns={handleResetColumns}
                onApplyColumnOrder={(newOrder) => setColumnOrder(newOrder)}
                allowReorder={true}
                anchorEl={columnMenuButtonRef.current}
            />
        </Paper>
    );
});

InvoiceDataGrid.displayName = 'InvoiceDataGrid';

export default InvoiceDataGrid;