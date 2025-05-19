import { Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Contractor, PaymentMethod, PaymentStatus } from '@app-types/types';
import { Settings } from 'luxon';

// Set global locale for Luxon library
Settings.defaultLocale = 'pl';

// Date formats configuration for Poland
const PL_FORMATS = {
    normalDate: 'dd.MM.yyyy', // Date format in the control
};

type InvoiceBasicInfoProps = {
    control: any;
    errors: any;
    contractors: Contractor[];
    getValues: (name: string) => any;
};

const InvoiceBasicInfo = ({ control, errors, contractors, getValues }: InvoiceBasicInfoProps) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                    Dane podstawowe
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Controller
                    name="invoiceNumber"
                    control={control}
                    rules={{ required: 'Numer faktury jest wymagany' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Numer faktury"
                            fullWidth
                            error={!!errors.invoiceNumber}
                            helperText={errors.invoiceNumber?.message}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.contractorId}>
                    <InputLabel id="contractor-label">Kontrahent</InputLabel>
                    <Controller
                        name="contractorId"
                        control={control}
                        rules={{
                            required: 'Kontrahent jest wymagany',
                            validate: value => value > 0 || 'Wybierz kontrahenta'
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="contractor-label"
                                label="Kontrahent"
                            >
                                <MenuItem value={0} disabled>Wybierz kontrahenta</MenuItem>
                                {contractors.map(contractor => (
                                    <MenuItem key={contractor.id} value={contractor.id}>
                                        {contractor.name} - {contractor.firstName} {contractor.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.contractorId && <FormHelperText>{errors.contractorId.message}</FormHelperText>}
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="pl">
                    <Controller
                        name="issueDate"
                        control={control}
                        rules={{ required: 'Data wystawienia jest wymagana' }}
                        render={({ field }) => (
                            <DatePicker
                                label="Data wystawienia"
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                format={PL_FORMATS.normalDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.issueDate,
                                        helperText: errors.issueDate?.message
                                    }
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="pl">
                    <Controller
                        name="dateDue"
                        control={control}
                        rules={{
                            required: 'Termin płatności jest wymagany',
                            validate: (value) => {
                                const issueDate = getValues('issueDate');
                                if (value && issueDate && value < issueDate) {
                                    return 'Termin płatności nie może być wcześniejszy niż data wystawienia';
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <DatePicker
                                label="Termin płatności"
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                format={PL_FORMATS.normalDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.dateDue,
                                        helperText: errors.dateDue?.message
                                    }
                                }}
                                minDate={getValues('issueDate')}
                            />
                        )}
                    />
                </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.paymentMethod}>
                    <InputLabel id="payment-method-label">Metoda płatności</InputLabel>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        rules={{ required: 'Metoda płatności jest wymagana' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="payment-method-label"
                                label="Metoda płatności"
                            >
                                {Object.values(PaymentMethod).map(method => (
                                    <MenuItem key={method} value={method}>
                                        {method === 'Cash' ? 'Gotówka' :
                                            method === 'Transfer' ? 'Przelew' :
                                                method === 'Card' ? 'Karta' : 'Inna'}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.paymentMethod && <FormHelperText>{errors.paymentMethod.message}</FormHelperText>}
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.paymentStatus}>
                    <InputLabel id="payment-status-label">Status płatności</InputLabel>
                    <Controller
                        name="paymentStatus"
                        control={control}
                        rules={{ required: 'Status płatności jest wymagany' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="payment-status-label"
                                label="Status płatności"
                                disabled={true} // Add disabled to prevent changing
                            >
                                {Object.values(PaymentStatus).map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status === 'Paid' ? 'Opłacona' :
                                            status === 'PartiallyPaid' ? 'Częściowo opłacona' :
                                                status === 'Unpaid' ? 'Nieopłacona' : 'Zaległa'}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.paymentStatus && <FormHelperText>{errors.paymentStatus.message}</FormHelperText>}
                    <FormHelperText>Status płatności jest ustalany automatycznie przez system</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Opis"
                            fullWidth
                            multiline
                            rows={2}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default InvoiceBasicInfo;