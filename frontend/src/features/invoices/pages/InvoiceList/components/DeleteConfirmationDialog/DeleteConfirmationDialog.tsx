import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * Dialog potwierdzenia przed usunięciem faktury
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title">
                Potwierdzenie usunięcia
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Czy na pewno chcesz usunąć tę fakturę? Tej operacji nie można cofnąć.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anuluj</Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    Usuń
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;