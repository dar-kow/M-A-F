import { Box, Typography, Paper, Divider, Grid, TextField, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import './InvoiceSummary.scss';

type InvoiceSummaryProps = {
    totals: {
        netTotal: number;
        vatTotal: number;
        grossTotal: number;
    };
    paidAmount: number | string; // Wartość z formularza
    onPaidAmountChange: (value: number) => void; // Callback do aktualizacji wartości
    errorMessage?: string; // Komunikat błędu
    disabled?: boolean;
};

const InvoiceSummary = ({
    totals,
    paidAmount,
    onPaidAmountChange,
    errorMessage,
    disabled = false
}: InvoiceSummaryProps) => {
    // Zabezpieczenie przed brakiem wartości
    const netTotal = totals?.netTotal || 0;
    const vatTotal = totals?.vatTotal || 0;
    const grossTotal = totals?.grossTotal || 0;

    // Lokalny stan dla pola wprowadzania
    const [localPaidAmount, setLocalPaidAmount] = useState<string>(paidAmount?.toString() || '0');

    // Synchronizacja ze stanem zewnętrznym
    useEffect(() => {
        setLocalPaidAmount((paidAmount ?? '0').toString());
    }, [paidAmount]);

    // Handler zmiany wartości
    const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalPaidAmount(newValue);
        // Konwertujemy na liczbę i wywołujemy callback tylko jeśli wartość jest prawidłowa
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
            onPaidAmountChange(numValue);
        } else {
            onPaidAmountChange(0);
        }
    };

    // Obliczenie pozostałej kwoty do zapłaty
    const numericPaidAmount = parseFloat(localPaidAmount) || 0;
    const remainingAmount = Math.max(0, grossTotal - numericPaidAmount);

    return (
        <Paper elevation={2} className="invoice-summary" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Lewa kolumna - informacje o płatnościach */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Informacje o płatności
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Pole "Zapłacono" */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130, mt: 1 }}>
                                    Zapłacono:
                                </Typography>
                                <Box sx={{ ml: 2, width: '160px' }}>
                                    <TextField
                                        value={localPaidAmount}
                                        onChange={handlePaidAmountChange}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        disabled={disabled}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                                        }}
                                        error={!!errorMessage}
                                        helperText={errorMessage}
                                    />
                                </Box>
                            </Box>

                            {/* Pole "Do zapłaty pozostało" */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>
                                    Do zapłaty pozostało:
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: remainingAmount > 0 ? 'error.main' : 'success.main',
                                        fontWeight: 'bold',
                                        ml: 2,
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    {remainingAmount.toFixed(2)} zł
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Prawa kolumna - wartości faktury */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Podsumowanie faktury
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}>
                            <Box className="summary-row">
                                <Typography variant="body2" className="summary-label" sx={{ minWidth: 120 }}>
                                    Razem netto:
                                </Typography>
                                <Typography variant="body2" className="summary-value" sx={{ fontFamily: 'monospace' }}>
                                    {netTotal.toFixed(2)} zł
                                </Typography>
                            </Box>

                            <Box className="summary-row">
                                <Typography variant="body2" className="summary-label" sx={{ minWidth: 120 }}>
                                    VAT:
                                </Typography>
                                <Typography variant="body2" className="summary-value" sx={{ fontFamily: 'monospace' }}>
                                    {vatTotal.toFixed(2)} zł
                                </Typography>
                            </Box>

                            <Divider sx={{ width: '100%', my: 1 }} />

                            <Box className="summary-row total">
                                <Typography variant="subtitle1" className="summary-label" sx={{ minWidth: 120 }}>
                                    Razem brutto:
                                </Typography>
                                <Typography variant="subtitle1" className="summary-value" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                                    {grossTotal.toFixed(2)} zł
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default InvoiceSummary;