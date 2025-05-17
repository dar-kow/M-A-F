import { useCallback, useState } from 'react';
import {
    Button,
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Select,
    MenuItem,
    IconButton,
    FormHelperText,
    InputAdornment
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { VatRate, Unit } from '@app-types/types';

interface InvoiceFormData {
    items: Array<{
        description: string;
        quantity: number;
        unit: Unit;
        unitPrice: number;
        vatRate: VatRate;
        [key: string]: any;
    }>;
    [key: string]: any;
}

type InvoiceItemsTableProps = {
    control: Control<InvoiceFormData>;
    errors: FieldErrors<InvoiceFormData>;
    fields: Record<"id", string>[];
    remove: (index: number) => void;
    handleAddItem: () => void;
    watchedItems: InvoiceFormData['items'];
    forceUpdate?: () => void;
};

const InvoiceItemsTable = ({
    control,
    errors,
    fields,
    remove,
    handleAddItem,
    watchedItems,
    forceUpdate
}: InvoiceItemsTableProps) => {
    // Dodajemy lokalny stan do wymuszenia aktualizacji
    const [localUpdateCounter, setLocalUpdateCounter] = useState(0);

    // Funkcja pomocnicza do formatowania wartości pieniężnych
    const formatCurrency = (value: number): string => {
        return value.toFixed(2) + ' zł';
    };

    // Lokalna funkcja wymuszająca aktualizację
    const localForceUpdate = useCallback(() => {
        setLocalUpdateCounter(prev => prev + 1);
    }, []);

    // Bezpieczna funkcja aktualizacji - używa przekazanej lub lokalnej
    const safeForceUpdate = useCallback(() => {
        if (typeof forceUpdate === 'function') {
            try {
                forceUpdate();
            } catch (e) {
                console.warn('Error calling forceUpdate from props:', e);
                localForceUpdate();
            }
        } else {
            localForceUpdate();
        }
    }, [forceUpdate, localForceUpdate]);

    // Funkcja wywoływana przy zmianie pola liczbowego
    // Poprawione: wyraźne określenie typu dla parametru e
    const handleNumberFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
        const value = parseFloat(e.target.value) || 0;
        onChange(value);
        // Używamy bezpiecznej funkcji aktualizacji
        setTimeout(safeForceUpdate, 0);
    }, [safeForceUpdate]);

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                    Pozycje faktury
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                >
                    Dodaj pozycję
                </Button>
            </Box>

            <Table size="small" className="invoice-items-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Opis</TableCell>
                        <TableCell>Ilość</TableCell>
                        <TableCell>Jednostka</TableCell>
                        <TableCell>Cena netto</TableCell>
                        <TableCell>VAT</TableCell>
                        <TableCell>Wartość netto</TableCell>
                        <TableCell>Wartość VAT</TableCell>
                        <TableCell>Wartość brutto</TableCell>
                        <TableCell>Akcje</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((field, index) => {
                        // Obliczenia wartości dla wiersza
                        const quantity = parseFloat(String(watchedItems?.[index]?.quantity || 0));
                        const unitPrice = parseFloat(String(watchedItems?.[index]?.unitPrice || 0));
                        const vatRate = parseFloat(String(watchedItems?.[index]?.vatRate || 0));

                        const netValue = quantity * unitPrice;
                        const vatValue = netValue * (vatRate / 100);
                        const grossValue = netValue + vatValue;

                        return (
                            <TableRow key={field.id}>
                                <TableCell>
                                    <Controller
                                        name={`items.${index}.description`}
                                        control={control}
                                        rules={{ required: 'Opis jest wymagany' }}
                                        render={({ field }) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    fullWidth
                                                    error={!!errors.items?.[index]?.description}
                                                />
                                                {errors.items?.[index]?.description && (
                                                    <FormHelperText error>
                                                        {errors.items?.[index]?.description?.message as string}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Controller
                                        name={`items.${index}.quantity`}
                                        control={control}
                                        rules={{
                                            required: 'Wymagane',
                                            min: { value: 0.01, message: 'Min. 0.01' }
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    size="small"
                                                    // Poprawione: prawidłowa struktura inputProps
                                                    inputProps={{
                                                        step: '0.01',
                                                        min: '0.01'
                                                    }}
                                                    error={!!errors.items?.[index]?.quantity}
                                                    // Poprawione: dodany as do konwersji typu zdarzenia
                                                    onChange={(e) => handleNumberFieldChange(e as React.ChangeEvent<HTMLInputElement>, field.onChange)}
                                                    // Poprawione: usunięty nieużywany parametr e
                                                    onBlur={() => {
                                                        field.onBlur();
                                                        safeForceUpdate();
                                                    }}
                                                />
                                                {errors.items?.[index]?.quantity && (
                                                    <FormHelperText error>
                                                        {errors.items?.[index]?.quantity?.message as string}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Controller
                                        name={`items.${index}.unit`}
                                        control={control}
                                        rules={{ required: 'Wymagane' }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    size="small"
                                                    error={!!errors.items?.[index]?.unit}
                                                >
                                                    {Object.values(Unit).map(unit => (
                                                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.items?.[index]?.unit && (
                                                    <FormHelperText error>
                                                        {errors.items?.[index]?.unit?.message as string}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Controller
                                        name={`items.${index}.unitPrice`}
                                        control={control}
                                        rules={{
                                            required: 'Wymagane',
                                            min: { value: 0, message: 'Min. 0' }
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    size="small"
                                                    // Poprawione: prawidłowa struktura inputProps i InputProps
                                                    inputProps={{
                                                        step: '0.01',
                                                        min: '0'
                                                    }}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">zł</InputAdornment>
                                                    }}
                                                    error={!!errors.items?.[index]?.unitPrice}
                                                    // Poprawione: dodany as do konwersji typu zdarzenia
                                                    onChange={(e) => handleNumberFieldChange(e as React.ChangeEvent<HTMLInputElement>, field.onChange)}
                                                    // Poprawione: usunięty nieużywany parametr e
                                                    onBlur={() => {
                                                        field.onBlur();
                                                        safeForceUpdate();
                                                    }}
                                                />
                                                {errors.items?.[index]?.unitPrice && (
                                                    <FormHelperText error>
                                                        {errors.items?.[index]?.unitPrice?.message as string}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Controller
                                        name={`items.${index}.vatRate`}
                                        control={control}
                                        rules={{ required: 'Wymagane' }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    {...field}
                                                    size="small"
                                                    error={!!errors.items?.[index]?.vatRate}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setTimeout(safeForceUpdate, 0);
                                                    }}
                                                >
                                                    {[
                                                        { value: 0, label: "0%" },
                                                        { value: 3, label: "3%" },
                                                        { value: 5, label: "5%" },
                                                        { value: 8, label: "8%" },
                                                        { value: 23, label: "23%" }
                                                    ].map(option => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.items?.[index]?.vatRate && (
                                                    <FormHelperText error>
                                                        {errors.items?.[index]?.vatRate?.message as string}
                                                    </FormHelperText>
                                                )}
                                            </>
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">
                                        {formatCurrency(netValue)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">
                                        {formatCurrency(vatValue)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Typography variant="body2">
                                        {formatCurrency(grossValue)}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (fields.length > 1) {
                                                remove(index);
                                                setTimeout(safeForceUpdate, 0);
                                            }
                                        }}
                                        disabled={fields.length <= 1}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {/* Wiersz podsumowania reaguje również na lokalny licznik aktualizacji */}
                    {watchedItems && watchedItems.length > 0 && (
                        <TableRow className="item-totals" key={`totals-row-${localUpdateCounter}`}>
                            <TableCell colSpan={5} align="right">
                                <Typography variant="subtitle2">Razem:</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2">
                                    {formatCurrency(watchedItems.reduce((sum, item) =>
                                        sum + (parseFloat(String(item.quantity || 0)) * parseFloat(String(item.unitPrice || 0))), 0)
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2">
                                    {formatCurrency(watchedItems.reduce((sum, item) => {
                                        const quantity = parseFloat(String(item.quantity || 0));
                                        const unitPrice = parseFloat(String(item.unitPrice || 0));
                                        const vatRate = parseFloat(String(item.vatRate || 0));
                                        return sum + (quantity * unitPrice * (vatRate / 100));
                                    }, 0))}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2">
                                    {formatCurrency(watchedItems.reduce((sum, item) => {
                                        const quantity = parseFloat(String(item.quantity || 0));
                                        const unitPrice = parseFloat(String(item.unitPrice || 0));
                                        const vatRate = parseFloat(String(item.vatRate || 0));
                                        return sum + (quantity * unitPrice * (1 + vatRate / 100));
                                    }, 0))}
                                </Typography>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Komunikat gdy brak pozycji */}
            {fields.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography color="text.secondary">
                        Brak pozycji. Dodaj pierwszą pozycję faktury.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default InvoiceItemsTable;