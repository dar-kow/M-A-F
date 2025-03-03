import React from 'react';
import { Box, Typography, Button, Chip, Modal } from '@mui/material';
import { Invoice } from '@app-types/types';
import { formatDate, formatAmount, formatPaymentMethod } from '@shared/utils/formatters';
import { getStatusChipColor, getPaymentStatusLabel } from '@shared/utils/statusHelpers';

interface InvoicePreviewModalProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice & { contractorName?: string } | null;
    onEdit: (id: number) => void;
}

/**
 * Modal podglądu szczegółów faktury
 */
const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
    open,
    onClose,
    invoice,
    onEdit
}) => {
    if (!invoice) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="invoice-preview-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 480,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="invoice-preview-title" variant="h6" component="h2" gutterBottom>
                    Faktura {invoice.number}
                </Typography>

                <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: 1 }}>
                    <Typography variant="body2" color="text.secondary">Kontrahent:</Typography>
                    <Typography variant="body1">{invoice.contractorName}</Typography>

                    <Typography variant="body2" color="text.secondary">Data wystawienia:</Typography>
                    <Typography variant="body1">{formatDate(invoice.issueDate)}</Typography>

                    <Typography variant="body2" color="text.secondary">Termin płatności:</Typography>
                    <Typography variant="body1">{formatDate(invoice.dueDate)}</Typography>

                    <Typography variant="body2" color="text.secondary">Metoda płatności:</Typography>
                    <Typography variant="body1">{formatPaymentMethod(invoice.paymentMethod)}</Typography>

                    <Typography variant="body2" color="text.secondary">Kwota:</Typography>
                    <Typography variant="body1">{formatAmount(invoice.totalAmount)}</Typography>

                    <Typography variant="body2" color="text.secondary">Zapłacono:</Typography>
                    <Typography variant="body1">{formatAmount(invoice.paidAmount || 0)}</Typography>

                    <Typography variant="body2" color="text.secondary">Status płatności:</Typography>
                    <Box>
                        <Chip
                            label={getPaymentStatusLabel(invoice.paymentStatus)}
                            color={getStatusChipColor(invoice.paymentStatus) as any}
                            size="small"
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary">Opis:</Typography>
                    <Typography variant="body1">{invoice.description || 'Brak'}</Typography>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose}>Zamknij</Button>
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ ml: 1 }}
                        onClick={() => {
                            onClose();
                            onEdit(invoice.id);
                        }}
                    >
                        Edytuj
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default InvoicePreviewModal;