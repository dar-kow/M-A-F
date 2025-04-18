import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, CircularProgress, Button } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Print as PrintIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Importy własnych komponentów
import InvoiceDataGrid from './components/InvoiceDataGrid/InvoiceDataGrid';
import InvoicePreviewModal from './components/InvoicePreviewModal/InvoicePreviewModal';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import InvoiceSettlementModal from './components/InvoiceSettlementModal/InvoiceSettlementModal'; // Nowy import

// Hooki i akcje
import useFetchInvoices from '../../hooks/useFetchInvoices';
import useFetchContractors from '../../../contractors/hooks/useFetchContractors';
import { deleteInvoiceRequest, updateInvoicePaymentRequest } from '../../redux/invoiceActions'; // Dodana nowa akcja
import { RootState } from '@store/rootReducer';
import { Invoice } from '@app-types/types';
import PrintService from '../../services/PrintService';

import './InvoiceList.scss';

interface InvoiceWithContractorName extends Invoice {
    contractorName?: string;
}

/**
 * Komponent strony listy faktur
 */
const InvoiceList: React.FC = () => {
    // Referencja do komponentu DataGrid
    const gridRef = useRef<any>(null);

    // Ref do kontenera całej strony
    const containerRef = useRef<HTMLElement>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Pobieranie danych
    const { invoices, loading, error } = useFetchInvoices();
    const { contractors } = useFetchContractors();

    // Redux state dla operacji
    const actionSuccess = useSelector((state: RootState) => state.invoices.actionSuccess);

    // Stan lokalny
    const [searchTerm, setSearchTerm] = useState('');
    const [processedInvoices, setProcessedInvoices] = useState<InvoiceWithContractorName[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<InvoiceWithContractorName | null>(null);

    // Nowe stany dla modala rozliczenia
    const [settlementModalOpen, setSettlementModalOpen] = useState(false);
    const [invoiceToSettle, setInvoiceToSettle] = useState<InvoiceWithContractorName | null>(null);

    // Połączenie faktur z kontrahentami
    useEffect(() => {
        if (invoices && contractors) {
            // Połącz faktury z kontrahentami
            const invoicesWithContractors = invoices.map(invoice => {
                // Znajdź kontrahenta dla faktury
                const contractor = contractors.find(c => c.id === invoice.contractorId);
                return {
                    ...invoice,
                    contractorName: contractor ? contractor.name : '-'
                };
            });

            setProcessedInvoices(invoicesWithContractors);
        }
    }, [invoices, contractors]);

    // Obsługa powiadomień
    useEffect(() => {
        if (actionSuccess) {
            toast.success('Operacja zakończona pomyślnie!');
        }
    }, [actionSuccess]);

    useEffect(() => {
        if (error) {
            toast.error(`Błąd: ${error}`);
        }
    }, [error]);

    // Funkcje obsługujące akcje
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
            dispatch(deleteInvoiceRequest(invoiceToDelete));
            setDeleteDialogOpen(false);
            setInvoiceToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setInvoiceToDelete(null);
    };

    // Funkcja drukowania tabeli
    const handlePrint = () => {
        if (processedInvoices.length > 0) {
            PrintService.printInvoiceList(processedInvoices, searchTerm);
        } else {
            toast.info("Brak faktur do wydrukowania");
        }
    };

    // Nowe funkcje obsługujące rozliczenie faktury
    const handleOpenSettlement = (invoice: InvoiceWithContractorName) => {
        setInvoiceToSettle(invoice);
        setSettlementModalOpen(true);
    };

    const handleCloseSettlement = () => {
        setSettlementModalOpen(false);
    };

    const handleSettleInvoice = (id: number, paidAmount: number) => {
        dispatch(updateInvoicePaymentRequest(id, paidAmount));
        setSettlementModalOpen(false);
    };

    // Filtrowanie faktur na podstawie searchTerm
    const filteredInvoices = processedInvoices.filter(invoice =>
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.contractorName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // Wskaźnik ładowania całej strony
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
                    onSettleInvoice={handleOpenSettlement} // Nowy prop dla obsługi rozliczenia
                    ref={gridRef}
                    autoHeight={true}
                    containerRef={containerRef}
                    headerOffset={90}
                />
            </div>

            {/* Modal podglądu faktury */}
            <InvoicePreviewModal
                open={previewOpen}
                onClose={handleClosePreview}
                invoice={previewInvoice}
                onEdit={previewInvoice?.id ? () => handleEditInvoice(previewInvoice.id) : undefined}
                data-testid="invoice-preview-modal"
            />

            {/* Nowy modal rozliczenia faktury */}
            <InvoiceSettlementModal
                open={settlementModalOpen}
                onClose={handleCloseSettlement}
                invoice={invoiceToSettle}
                onConfirm={handleSettleInvoice}
                data-testid="invoice-settlement-modal"
            />

            {/* Dialog potwierdzenia usunięcia */}
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