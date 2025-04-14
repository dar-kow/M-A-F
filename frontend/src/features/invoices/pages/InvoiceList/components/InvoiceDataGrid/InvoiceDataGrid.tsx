import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Paper, ClickAwayListener } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { Invoice } from '@app-types/types';
import CustomColumnsPanel from './CustomColumnsPanel';
import { getInvoiceColumns } from './InvoiceColumns/InvoiceColumns';
import InvoiceFilterHeader from '../InvoiceFilterHeader/InvoiceFilterHeader';
import { GridWrapper } from './components/GridWrapper';
import { useColumnFilters } from './hooks/useColumnFilters';
import { useColumnManagement } from './hooks/useColumnManagement';
import { useAutoHeight } from './hooks/useAutoHeight';
import { useDelayedLoading } from './hooks/useDelayedLoading';
import { filterInvoices } from './utils/filtering';

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
    autoHeight?: boolean;
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
    height = 600,
    autoHeight = false,
    containerRef,
    headerOffset = 90
}, ref) => {
    const gridWrapperRef = useRef<HTMLDivElement>(null);
    const columnMenuButtonRef = useRef<HTMLButtonElement | null>(null);
    const apiRef = useGridApiRef();
    const [columnsMenuOpen, setColumnsMenuOpen] = React.useState(false);

    // Użycie customowych hooków
    const {
        columnFilters,
        activeFilterField,
        handleColumnFilterChange,
        clearColumnFilter,
        handleClickAwayFilter
    } = useColumnFilters();

    const {
        columnVisibilityModel,
        setColumnVisibilityModel,
        columnOrder,
        setColumnOrder,
        handleResetColumns
    } = useColumnManagement({
        visibilityKey: COLUMN_VISIBILITY_KEY,
        orderKey: COLUMN_ORDER_KEY
    });

    const calculatedHeight = useAutoHeight({
        autoHeight,
        defaultHeight: height,
        containerRef,
        wrapperRef: gridWrapperRef,
        headerOffset
    });

    const { showData } = useDelayedLoading({
        isLoading,
        dataLength: invoices.length
    });

    // Handler otwierania selektora kolumn
    const handleOpenColumnSelector = () => {
        setColumnsMenuOpen(true);
    };

    // Eksponujemy funkcje dla komponentu nadrzędnego przez ref
    useImperativeHandle(ref, () => ({
        openColumnSelector: handleOpenColumnSelector
    }));

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

    // Filtrowanie danych
    const filteredData = React.useMemo(() =>
        filterInvoices(invoices, columnFilters),
        [invoices, columnFilters]
    );

    // Finalna wysokość do użycia
    const finalHeight = autoHeight ? calculatedHeight : height;

    // Renderowanie
    return (
        <Paper
            className="invoice-datagrid"
            ref={gridWrapperRef}
            data-testid="invoice-grid"
            sx={{
                height: `${finalHeight}px`,
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <GridWrapper
                rows={showData ? filteredData : []}
                columns={sortedColumns}
                loading={isLoading || !showData}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                apiRef={apiRef}
                height="100%"
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