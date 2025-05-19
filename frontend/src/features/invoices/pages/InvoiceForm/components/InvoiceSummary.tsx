import { Box, Typography, Paper, Divider, TextField, InputAdornment, Grid } from '@mui/material';
import { Controller } from 'react-hook-form';
import './InvoiceSummary.scss';

type InvoiceSummaryProps = {
    totals: {
        netTotal: number;
        vatTotal: number;
        grossTotal: number;
    };
    control: any;
    paidAmount: number;
    disabled?: boolean;
};

const InvoiceSummary = ({
    totals,
    control,
    paidAmount = 0,
    disabled = false
}: InvoiceSummaryProps) => {
    // Protection against missing values
    const netTotal = totals?.netTotal || 0;
    const vatTotal = totals?.vatTotal || 0;
    const grossTotal = totals?.grossTotal || 0;

    // Calculate remaining amount to pay
    const remainingAmount = Math.max(0, grossTotal - paidAmount);

    return (
        <Paper elevation={2} className="invoice-summary" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Left column - payment information */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                            Informacje o płatności
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>
                                    Zapłacono:
                                </Typography>
                                <Box sx={{ ml: 2, flexGrow: 1, maxWidth: '50%' }}>
                                    <Controller
                                        name="paidAmount"
                                        control={control}
                                        rules={{
                                            min: { value: 0, message: 'Wartość nie może być ujemna' },
                                            max: { value: grossTotal, message: 'Wartość nie może być większa niż kwota faktury' }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                size="small"
                                                fullWidth
                                                disabled={disabled}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                                                }}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>
                                    Do zapłaty pozostało:
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: remainingAmount > 0 ? 'error.main' : 'success.main',
                                        fontWeight: 'bold',
                                        ml: 2
                                    }}
                                >
                                    {remainingAmount.toFixed(2)} zł
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right column - invoice values */}
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