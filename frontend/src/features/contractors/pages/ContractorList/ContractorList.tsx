import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, IconButton,
    Typography, TextField, Box, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import useFetchContractors from '../../hooks/useFetchContractors';
import { deleteContractorRequest } from '../../redux/contractorActions';
import { RootState } from '../../../../store/rootReducer';
import './ContractorList.scss';

function ContractorList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { contractors, loading, error } = useFetchContractors();

    // Redux state for operations
    const actionSuccess = useSelector((state: RootState) => state.contractors.actionSuccess);

    // Local state
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContractors, setFilteredContractors] = useState(contractors);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [contractorToDelete, setContractorToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (contractors) {
            const filtered = contractors.filter(contractor =>
                contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contractor.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const sorted = [...filtered].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setFilteredContractors(sorted);
        }
    }, [contractors, searchTerm]);

    // Effect for handling success actions
    useEffect(() => {
        if (actionSuccess) {
            toast.success('Operation completed successfully!');
        }
    }, [actionSuccess]);

    // Effect for handling errors
    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddContractor = () => {
        navigate('/contractors/new');
    };

    const handleEditContractor = (id: number) => {
        navigate(`/contractors/edit/${id}`);
    };

    const openDeleteDialog = (id: number) => {
        setContractorToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (contractorToDelete !== null) {
            dispatch(deleteContractorRequest(contractorToDelete));
            setDeleteDialogOpen(false);
            setContractorToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setContractorToDelete(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="contractor-list">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Kontrahenci</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddContractor}
                >
                    Dodaj kontrahenta
                </Button>
            </Box>

            <Box mb={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Szukaj kontrahenta"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table aria-label="contractors table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Imię i nazwisko</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>NIP</TableCell>
                            <TableCell>Miasto</TableCell>
                            <TableCell align="right">Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContractors.length > 0 ? (
                            filteredContractors.map((contractor) => (
                                <TableRow key={contractor.id}>
                                    <TableCell>{contractor.name}</TableCell>
                                    <TableCell>{`${contractor.firstName} ${contractor.lastName}`}</TableCell>
                                    <TableCell>{contractor.email}</TableCell>
                                    <TableCell>{contractor.taxId}</TableCell>
                                    <TableCell>{contractor.city}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => handleEditContractor(contractor.id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => openDeleteDialog(contractor.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    {contractors.length === 0 ? 'Brak kontrahentów' : 'Brak wyników wyszukiwania'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    Czy na pewno chcesz usunąć tego kontrahenta? Tej operacji nie można cofnąć.
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Anuluj</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ContractorList;