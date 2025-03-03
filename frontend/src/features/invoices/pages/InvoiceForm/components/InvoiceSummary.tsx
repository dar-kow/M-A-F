import { Box, Typography, Paper } from '@mui/material';
import './InvoiceSummary.scss';

type InvoiceSummaryProps = {
    totals: {
        netTotal: number;
        vatTotal: number;
        grossTotal: number;
    };
};

const InvoiceSummary = ({ totals }: InvoiceSummaryProps) => {
    // Zabezpieczenie przed brakiem wartości
    const netTotal = totals?.netTotal || 0;
    const vatTotal = totals?.vatTotal || 0;
    const grossTotal = totals?.grossTotal || 0;

    console.log('InvoiceSummary rendering with totals:', totals);

    return (
        <Paper elevation={2} className="invoice-summary">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                mt: 3,
                mb: 2,
                padding: 2,
                borderRadius: 1
            }}>
                <Box className="summary-row">
                    <Typography variant="body1" className="summary-label">
                        Wartość netto:
                    </Typography>
                    <Typography variant="body1" className="summary-value">
                        {netTotal.toFixed(2)} zł
                    </Typography>
                </Box>

                <Box className="summary-row">
                    <Typography variant="body1" className="summary-label">
                        Wartość VAT:
                    </Typography>
                    <Typography variant="body1" className="summary-value">
                        {vatTotal.toFixed(2)} zł
                    </Typography>
                </Box>

                <Box className="summary-row total">
                    <Typography variant="subtitle1" className="summary-label">
                        Wartość brutto:
                    </Typography>
                    <Typography variant="subtitle1" className="summary-value">
                        {grossTotal.toFixed(2)} zł
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default InvoiceSummary;