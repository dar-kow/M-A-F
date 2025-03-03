import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
    Add as AddIcon,
    Print as PrintIcon,
    // FileDownload as FileDownloadIcon
} from '@mui/icons-material';
// import { toast } from 'react-toastify';

interface InvoiceToolbarProps {
    onAddInvoice: () => void;
    onPrint: () => void;
    title: string;
}

/**
 * Pasek narzędzi z tytułem i przyciskami akcji dla listy faktur
 */
const InvoiceToolbar: React.FC<InvoiceToolbarProps> = ({
    onAddInvoice,
    onPrint,
    title
}) => {
    /**
     * Obsługa eksportu do CSV - do poprawy / zaimplementować ze stylowaniem jak kiedyś! ewentualnie poszukaj lepszej biblioteki 
     */
    // const handleExportCSV = () => {
    //     // Próba pobrania API DataGrid
    //     const apiRef = document.querySelector('.MuiDataGrid-root')?.__reactProps$?.gridApiRef;

    //     if (apiRef) {
    //         // Jeśli mamy dostęp do API, używamy wbudowanych funkcji
    //         const csvOptions = {
    //             delimiter: ';',
    //             fileName: 'faktury-export',
    //             utf8WithBom: true
    //         };
    //         apiRef.current.exportDataAsCsv(csvOptions);
    //     } else {
    //         // Fallback - informacja dla użytkownika
    //         toast.info('Eksport CSV...');
    //     }
    // };

    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">{title}</Typography>
            <Box className="action-buttons">
                {/* <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportCSV}
                    sx={{ mr: 1 }}
                >
                    Export CSV
                </Button> */}
                <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    startIcon={<PrintIcon />}
                    onClick={onPrint}
                    sx={{ mr: 1 }}
                >
                    Drukuj
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAddInvoice}
                >
                    Dodaj fakturę
                </Button>
            </Box>
        </Box>
    );
};

export default InvoiceToolbar;