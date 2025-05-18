import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, CircularProgress, Button } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Print as PrintIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Import custom components
import InvoiceDataGrid from './components/InvoiceDataGrid/InvoiceDataGrid';
import InvoicePreviewModal from './components/InvoicePreviewModal/InvoicePreviewModal';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import InvoiceSettlementModal from './components/InvoiceSettlementModal/InvoiceSettlementModal'; // New import

// Hooks and actions
import useFetchInvoices from '../../hooks/useFetchInvoices';
import useFetchContractors from '../../../contractors/hooks/useFetchContractors';
import {
    deleteInvoiceRequest,
    updateInvoicePaymentRequest,
    clearActionStatus  // New action
} from '../../redux/invoiceActions';
import { RootState } from '@store/rootReducer';
import { Invoice } from '@app-types/types';
import PrintService from '../../services/PrintService';

import './InvoiceList.scss';

interface InvoiceWithContractorName extends Invoice {
    contractorName?: string;
}

/**
 * Invoice list page component
 */
const InvoiceList: React.FC = () => {
    // Reference to the DataGrid component
    const gridRef = useRef<any>(null);

    // Ref to the whole page container
    const containerRef = useRef<HTMLElement>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Fetch data
    const { invoices, loading, error } = useFetchInvoices();
    const { contractors } = useFetchContractors();

    // Redux state for operations
    const actionSuccess = useSelector((state: RootState) => state.invoices.actionSuccess);
    const lastActionType = useSelector((state: RootState) => state.invoices.lastActionType);

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [processedInvoices, setProcessedInvoices] = useState<InvoiceWithContractorName[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<InvoiceWithContractorName | null>(null);

    // New state for settlement modal
    const [settlementModalOpen, setSettlementModalOpen] = useState(false);
    const [invoiceToSettle, setInvoiceToSettle] = useState<InvoiceWithContractorName | null>(null);

    // Merge invoices with contractors
    useEffect(() => {
        if (invoices && contractors) {
            // Merge invoices with contractors
            const invoicesWithContractors = invoices.map(invoice => {
                // Find contractor for invoice
                const contractor = contractors.find(c => c.id === invoice.contractorId);
                return {
                    ...invoice,
                    contractorName: contractor ? contractor.name : '-'
                };
            });

            setProcessedInvoices(invoicesWithContractors);
        }
    }, [invoices, contractors]);

    useEffect(() => {
        if (actionSuccess) {
            switch (lastActionType) {
                case 'CREATE':
                    toast.success('Faktura została pomyślnie utworzona!');
                    break;
                case 'UPDATE':
                    toast.success('Faktura została pomyślnie zaktualizowana!');
                    break;
                case 'DELETE':
                    toast.success('Faktura została pomyślnie usunięta!');
                    break;
                case 'PAYMENT':
                    toast.success('Płatność faktury została pomyślnie zaktualizowana!');
                    break;
                default:
                    toast.success('Operacja zakończona pomyślnie!');
            }

            dispatch(clearActionStatus());
        }
    }, [actionSuccess, lastActionType, dispatch]);

    useEffect(() => {
        if (error) {
            switch (lastActionType) {
                case 'CREATE':
                    toast.error(`Błąd podczas tworzenia faktury: ${error}`);
                    break;
                case 'UPDATE':
                    toast.error(`Błąd podczas aktualizacji faktury: ${error}`);
                    break;
                case 'DELETE':
                    toast.error(`Błąd podczas usuwania faktury: ${error}`);
                    break;
                case 'PAYMENT':
                    toast.error(`Błąd podczas aktualizacji płatności: ${error}`);
                    break;
                default:
                    toast.error(`Błąd: ${error}`);
            }

            dispatch(clearActionStatus());
        }
    }, [error, lastActionType, dispatch]);

    // Action handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddInvoice = () => {
        navigate('/invoices/new');
    };

    const handleEditInvoice = (id: number) => {
        navigate(`/invoices/edit/${id}`);
    };

    const handleOpenPreview = (invoice: InvoiceWithContractorName) => {
        setPreviewInvoice(invoice);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    const handleDeleteInvoice = (id: number) => {
        setInvoiceToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (invoiceToDelete !== null) {
            const invoiceToDeleteData = processedInvoices.find(i => i.id === invoiceToDelete);
            if (invoiceToDeleteData) {
                toast.info(`Usuwanie faktury ${invoiceToDeleteData.number}...`);
            }

            dispatch(deleteInvoiceRequest(invoiceToDelete));
            setDeleteDialogOpen(false);
            setInvoiceToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setInvoiceToDelete(null);
    };

    // Print table function
    const handlePrint = () => {
        if (processedInvoices.length > 0) {
            PrintService.printInvoiceList(processedInvoices, searchTerm);
        } else {
            toast.info("Brak faktur do wydrukowania");
        }
    };

    // New handlers for invoice settlement
    const handleOpenSettlement = (invoice: InvoiceWithContractorName) => {
        setInvoiceToSettle(invoice);
        setSettlementModalOpen(true);
    };

    const handleCloseSettlement = () => {
        setSettlementModalOpen(false);
    };

    const handleSettleInvoice = (id: number, paidAmount: number) => {
        // Added informational notification
        const invoiceData = processedInvoices.find(i => i.id === id);
        if (invoiceData) {
            toast.info(`Aktualizowanie płatności faktury ${invoiceData.number}...`);
        }

        dispatch(updateInvoicePaymentRequest(id, paidAmount));
        setSettlementModalOpen(false);
    };

    // Filter invoices based on searchTerm
    const filteredInvoices = processedInvoices.filter(invoice =>
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.contractorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Loading indicator for the whole page
    if (loading && processedInvoices.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="invoice-list-wrapper" ref={containerRef as React.RefObject<HTMLDivElement>}>
            <div className="invoice-list-header">
                <div className="search-container">
                    <TextField
                        label="Szukaj faktury"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                        data-testid="invoice-search"
                    />
                </div>

                <div className="actions-container">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        disabled={filteredInvoices.length === 0}
                        data-testid="invoice-print-btn"
                    >
                        Drukuj
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddInvoice}
                        data-testid="invoice-add-btn"
                    >
                        Dodaj fakturę
                    </Button>
                </div>
            </div>

            <div className="invoice-list-container">
                <InvoiceDataGrid
                    invoices={filteredInvoices}
                    isLoading={loading}
                    onEditInvoice={handleEditInvoice}
                    onDeleteInvoice={handleDeleteInvoice}
                    onPreviewInvoice={handleOpenPreview}
                    onSettleInvoice={handleOpenSettlement}
                    ref={gridRef}
                    autoHeight={true}
                    containerRef={containerRef}
                    headerOffset={90}
                />
            </div>

            {/* Invoice preview modal */}
            <InvoicePreviewModal
                open={previewOpen}
                onClose={handleClosePreview}
                invoice={previewInvoice}
                onEdit={handleEditInvoice}
                data-testid="invoice-preview-modal"
            />

            {/* New invoice settlement modal */}
            <InvoiceSettlementModal
                open={settlementModalOpen}
                onClose={handleCloseSettlement}
                invoice={invoiceToSettle}
                onConfirm={handleSettleInvoice}
                data-testid="invoice-settlement-modal"
            />

            {/* Delete confirmation dialog */}
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                data-testid="invoice-delete-dialog"
            />
        </div>
    );
};

export default InvoiceList;