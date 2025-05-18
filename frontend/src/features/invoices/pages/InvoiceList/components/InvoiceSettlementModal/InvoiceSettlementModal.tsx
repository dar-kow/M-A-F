import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    InputAdornment,
    Paper,
    Divider,
    Chip
} from '@mui/material';
import { Invoice } from '@app-types/types';
import { formatAmount } from '@shared/utils/formatters';
import { getStatusChipColor, getPaymentStatusLabel } from '@shared/utils/statusHelpers';

interface InvoiceSettlementModalProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice & { contractorName?: string } | null;
    onConfirm: (id: number, paidAmount: number) => void;
}

const InvoiceSettlementModal: React.FC<InvoiceSettlementModalProps> = ({
    open,
    onClose,
    invoice,
    onConfirm
}) => {
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [paymentDiff, setPaymentDiff] = useState<number>(0);

    // Reset state when invoice changes
    useEffect(() => {
        if (invoice) {
            const currentPaidAmount = invoice.paidAmount || 0;
            setPaidAmount(currentPaidAmount);

            // Calculate difference for initial values
            setPaymentDiff(
                Math.max(0, invoice.totalAmount - currentPaidAmount)
            );
        }
    }, [invoice]);

    // Update difference when paid amount changes
    useEffect(() => {
        if (invoice) {
            setPaymentDiff(
                Math.max(0, invoice.totalAmount - paidAmount)
            );
        }
    }, [paidAmount, invoice]);

    if (!invoice) return null;

    const handleConfirm = () => {
        // Usuwamy toast informacyjny stąd, ponieważ będzie wyświetlony w handleSettleInvoice
        onConfirm(invoice.id, paidAmount);
    };

    const handleFullPayment = () => {
        setPaidAmount(invoice.totalAmount);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="settlement-modal-title"
        >
            <Paper
                data-testid="invoice-settlement-modal"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 1,
                }}
            >
                <Typography id="settlement-modal-title" variant="h6" component="h2" gutterBottom>
                    Rozliczenie faktury {invoice.number}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Kontrahent:</Typography>
                        <Typography variant="body2">{invoice.contractorName}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Status płatności:</Typography>
                        <Chip
                            label={getPaymentStatusLabel(invoice.paymentStatus)}
                            color={getStatusChipColor(invoice.paymentStatus) as any}
                            size="small"
                        />
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    mb: 3
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Kwota faktury:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {formatAmount(invoice.totalAmount)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Zapłacono:</Typography>
                        <Typography variant="body1" color={invoice.paidAmount ? 'success.main' : 'text.primary'}>
                            {formatAmount(invoice.paidAmount || 0)}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Pozostało do zapłaty:</Typography>
                        <Typography
                            variant="body1"
                            color={paymentDiff > 0 ? 'error.main' : 'success.main'}
                            fontWeight="bold"
                        >
                            {formatAmount(paymentDiff)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Kwota zapłacona"
                        type="number"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(Number(e.target.value))}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                        }}
                    />

                    <Button
                        variant="text"
                        size="small"
                        onClick={handleFullPayment}
                        sx={{ mt: 1 }}
                    >
                        Zapłać całość
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Anuluj
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        disabled={paidAmount === invoice.paidAmount}
                    >
                        Rozlicz fakturę
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default InvoiceSettlementModal;