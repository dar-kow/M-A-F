import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField, Button, Grid, Paper, Typography,
    Box, CircularProgress, Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import { RootState } from '../../../../store/rootReducer';
import {
    fetchContractorRequest,
    createContractorRequest,
    updateContractorRequest,
    clearContractor,
    clearErrors
} from '../../redux/contractorActions';
import { Contractor } from '../../../../types/types';
import './ContractorForm.scss';

type FormData = Omit<Contractor, 'id' | 'createdAt'>;

function ContractorForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEdit = Boolean(id);

    // Redux state
    const contractor = useSelector((state: RootState) => state.contractors.contractor);
    const loading = useSelector((state: RootState) => state.contractors.loading);
    const error = useSelector((state: RootState) => state.contractors.error);
    const actionSuccess = useSelector((state: RootState) => state.contractors.actionSuccess);

    // React Hook Form
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            taxId: '',
            street: '',
            buildingNumber: '',
            apartmentNumber: '',
            city: '',
            postalCode: '',
        }
    });

    // Load contractor data if in edit mode
    useEffect(() => {
        if (isEdit && id) {
            dispatch(fetchContractorRequest(Number(id)));
        }

        // Cleanup on unmount
        return () => {
            dispatch(clearContractor());
            dispatch(clearErrors());
        };
    }, [dispatch, isEdit, id]);

    // Populate form with contractor data
    useEffect(() => {
        if (isEdit && contractor) {
            reset({
                name: contractor.name,
                firstName: contractor.firstName,
                lastName: contractor.lastName,
                email: contractor.email,
                taxId: contractor.taxId,
                street: contractor.street,
                buildingNumber: contractor.buildingNumber,
                apartmentNumber: contractor.apartmentNumber,
                city: contractor.city,
                postalCode: contractor.postalCode,
            });
        }
    }, [reset, contractor, isEdit]);

    // Handle action success
    useEffect(() => {
        if (actionSuccess) {
            toast.success(`Kontrahent ${isEdit ? 'zaktualizowany' : 'dodany'} pomyślnie!`);
            navigate('/contractors');
            dispatch(clearErrors());
        }
    }, [actionSuccess, navigate, isEdit, dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]);

    const onSubmit = (data: FormData) => {
        if (isEdit && id) {
            dispatch(updateContractorRequest({
                ...data,
                id: Number(id),
                createdAt: contractor?.createdAt || new Date().toISOString()
            }));
        } else {
            dispatch(createContractorRequest({
                ...data,
                createdAt: new Date().toISOString()
            } as Contractor));
        }
    };

    const handleCancel = () => {
        navigate('/contractors');
    };

    if (loading && isEdit) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="contractor-form">
            <Paper elevation={3} className="form-paper">
                <Typography variant="h5" component="h2" gutterBottom>
                    {isEdit ? 'Edytuj kontrahenta' : 'Dodaj kontrahenta'}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Dane podstawowe
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Nazwa jest wymagana' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nazwa firmy"
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: 'Imię jest wymagane' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Imię"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: 'Nazwisko jest wymagane' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nazwisko"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email jest wymagany',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Nieprawidłowy adres email'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="taxId"
                                control={control}
                                rules={{ required: 'NIP jest wymagany' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="NIP"
                                        fullWidth
                                        error={!!errors.taxId}
                                        helperText={errors.taxId?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                Adres
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="street"
                                control={control}
                                rules={{ required: 'Ulica jest wymagana' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Ulica"
                                        fullWidth
                                        error={!!errors.street}
                                        helperText={errors.street?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="buildingNumber"
                                control={control}
                                rules={{ required: 'Numer budynku jest wymagany' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Numer budynku"
                                        fullWidth
                                        error={!!errors.buildingNumber}
                                        helperText={errors.buildingNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="apartmentNumber"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Numer lokalu"
                                        fullWidth
                                        error={!!errors.apartmentNumber}
                                        helperText={errors.apartmentNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: 'Miasto jest wymagane' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Miasto"
                                        fullWidth
                                        error={!!errors.city}
                                        helperText={errors.city?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="postalCode"
                                control={control}
                                rules={{
                                    required: 'Kod pocztowy jest wymagany',
                                    pattern: {
                                        value: /^\d{2}-\d{3}$/,
                                        message: 'Nieprawidłowy format kodu pocztowego (XX-XXX)'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Kod pocztowy"
                                        placeholder="XX-XXX"
                                        fullWidth
                                        error={!!errors.postalCode}
                                        helperText={errors.postalCode?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Anuluj
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : isEdit ? (
                                        'Zapisz zmiany'
                                    ) : (
                                        'Dodaj kontrahenta'
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </div>
    );
}

export default ContractorForm;