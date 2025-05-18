import { Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
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
                    Basic data
                </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Controller
                    name="invoiceNumber"
                    control={control}
                    rules={{ required: 'Invoice number is required' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Invoice number"
                            fullWidth
                            error={!!errors.invoiceNumber}
                            helperText={errors.invoiceNumber?.message}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.contractorId}>
                    <InputLabel id="contractor-label">Contractor</InputLabel>
                    <Controller
                        name="contractorId"
                        control={control}
                        rules={{
                            required: 'Contractor is required',
                            validate: value => value > 0 || 'Select a contractor'
                        }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="contractor-label"
                                label="Contractor"
                            >
                                <MenuItem value={0} disabled>Select a contractor</MenuItem>
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
                        rules={{ required: 'Issue date is required' }}
                        render={({ field }) => (
                            <DatePicker
                                label="Issue date"
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
                            required: 'Due date is required',
                            validate: (value) => {
                                const issueDate = getValues('issueDate');
                                if (value && issueDate && value < issueDate) {
                                    return 'Due date cannot be earlier than issue date';
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <DatePicker
                                label="Due date"
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
                    <InputLabel id="payment-method-label">Payment method</InputLabel>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        rules={{ required: 'Payment method is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="payment-method-label"
                                label="Payment method"
                            >
                                {Object.values(PaymentMethod).map(method => (
                                    <MenuItem key={method} value={method}>
                                        {method === 'Cash' ? 'Cash' :
                                            method === 'Transfer' ? 'Transfer' :
                                                method === 'Card' ? 'Card' : 'Other'}
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
                    <InputLabel id="payment-status-label">Payment status</InputLabel>
                    <Controller
                        name="paymentStatus"
                        control={control}
                        rules={{ required: 'Payment status is required' }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                labelId="payment-status-label"
                                label="Payment status"
                                disabled={true} // Add disabled to prevent changing
                            >
                                {Object.values(PaymentStatus).map(status => (
                                    <MenuItem key={status} value={status}>
                                        {status === 'Paid' ? 'Paid' :
                                            status === 'PartiallyPaid' ? 'Partially paid' :
                                                status === 'Unpaid' ? 'Unpaid' : 'Overdue'}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                    {errors.paymentStatus && <FormHelperText>{errors.paymentStatus.message}</FormHelperText>}
                    <FormHelperText>Payment status is set automatically by the system</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Controller
                    name="paidAmount"
                    control={control}
                    rules={{
                        min: { value: 0, message: 'Value cannot be negative' }
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Paid amount"
                            type="number"
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                            }}
                            error={!!errors.paidAmount}
                            helperText={errors.paidAmount?.message}
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12}>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Description"
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