import { Button, Box, CircularProgress } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

type InvoiceActionsProps = {
    isEdit: boolean;
    loading: boolean;
    onCancel: () => void;
};

const InvoiceActions = ({ isEdit, loading, onCancel }: InvoiceActionsProps) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4,
            mb: 2
        }}>
            <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={onCancel}
                disabled={loading}
            >
                Anuluj
            </Button>

            <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                type="submit"
                disabled={loading}
            >
                {isEdit ? 'Aktualizuj fakturę' : 'Wystaw fakturę'}
            </Button>
        </Box>
    );
};

export default InvoiceActions;