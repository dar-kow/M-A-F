import { useEffect } from 'react';
import { Paper, Typography, Divider, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

import { useInvoiceForm } from './hooks/useInvoiceForm';
import InvoiceBasicInfo from './components/InvoiceBasicInfo';
import InvoiceItemsTable from './components/InvoiceItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceActions from './components/InvoiceActions';
import './InvoiceForm.scss';

function InvoiceForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    // Redux state
    const loading = useSelector((state: RootState) => state.invoices.loading);
    const error = useSelector((state: RootState) => state.invoices.error);
    const actionSuccess = useSelector((state: RootState) => state.invoices.actionSuccess);

    // Custom hook z całą logiką formularza
    const {
        formMethods,
        totals,
        contractors,
        handleSubmit,
        handleCancel,
        handleAddItem,
        fields,
        remove,
        watchedItems,
        updateCounter,
        forceUpdate
    } = useInvoiceForm(isEdit, id ? Number(id) : undefined);

    // Obsługa błędów i sukcesu
    useEffect(() => {
        if (actionSuccess) {
            toast.success(`Faktura ${isEdit ? 'zaktualizowana' : 'dodana'} pomyślnie!`);
        }
    }, [actionSuccess, isEdit]);

    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]);

    // Dodany efekt do aktualizacji daty płatności gdy zmienia się data wystawienia
    useEffect(() => {
        const subscription = formMethods.watch((value, { name }) => {
            if (name === 'issueDate') {
                // Pobierz aktualne wartości
                const issueDate = value.issueDate;
                const currentDueDate = value.dateDue;

                // Jeśli data płatności jest przed datą wystawienia, zaktualizuj ją
                if (currentDueDate < issueDate) {
                    formMethods.setValue('dateDue', issueDate.plus({ days: 14 }));
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [formMethods]);

    if (loading && isEdit) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="invoice-form">
            <Paper elevation={3} className="form-paper">
                <Typography variant="h5" component="h2" gutterBottom>
                    {isEdit ? 'Edytuj fakturę' : 'Wystaw nową fakturę'}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
                    {/* Sekcja z podstawowymi danymi */}
                    <InvoiceBasicInfo
                        control={formMethods.control}
                        errors={formMethods.formState.errors}
                        contractors={contractors}
                        getValues={formMethods.getValues} // Dodane przekazanie funkcji getValues
                    />

                    {/* Sekcja z pozycjami faktury */}
                    <InvoiceItemsTable
                        control={formMethods.control as any}
                        errors={formMethods.formState.errors}
                        fields={fields}
                        remove={remove}
                        handleAddItem={handleAddItem}
                        watchedItems={watchedItems}
                        forceUpdate={forceUpdate}
                    />

                    {/* Sekcja z podsumowaniem */}
                    <InvoiceSummary
                        totals={totals}
                        key={`summary-${updateCounter}`} // Dodaj tę linię
                    />

                    {/* Przyciski akcji */}
                    <InvoiceActions
                        isEdit={isEdit}
                        loading={loading}
                        onCancel={handleCancel}
                    />
                </form>
            </Paper>
        </div>
    );
}

export default InvoiceForm;