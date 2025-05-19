import { useEffect } from 'react';
import { Paper, Typography, Divider, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { clearActionStatus } from '../../redux/invoiceActions';

import { useInvoiceForm } from './hooks/useInvoiceForm';
import InvoiceBasicInfo from './components/InvoiceBasicInfo';
import InvoiceItemsTable from './components/InvoiceItemsTable';
import InvoiceSummary from './components/InvoiceSummary';
import InvoiceActions from './components/InvoiceActions';
import { DateTime } from 'luxon';
import './InvoiceForm.scss';

function InvoiceForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    // Add dispatch
    const dispatch = useDispatch();

    // Redux state
    const loading = useSelector((state: RootState) => state.invoices.loading);
    const error = useSelector((state: RootState) => state.invoices.error);
    const actionSuccess = useSelector((state: RootState) => state.invoices.actionSuccess);
    const lastActionType = useSelector((state: RootState) => state.invoices.lastActionType);

    // Custom hook with all form logic
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

    useEffect(() => {
        if (actionSuccess) {
            switch (lastActionType) {
                case 'CREATE':
                    toast.success('Faktura została pomyślnie utworzona!');
                    break;
                case 'UPDATE':
                    toast.success('Faktura została pomyślnie zaktualizowana!');
                    break;
                default:
                    toast.success(`Faktura ${isEdit ? 'zaktualizowana' : 'dodana'} pomyślnie!`);
            }

            dispatch(clearActionStatus());
        }
    }, [actionSuccess, isEdit, lastActionType, dispatch]);

    useEffect(() => {
        if (error) {
            switch (lastActionType) {
                case 'CREATE':
                    toast.error(`Błąd podczas tworzenia faktury: ${error}`);
                    break;
                case 'UPDATE':
                    toast.error(`Błąd podczas aktualizacji faktury: ${error}`);
                    break;
                default:
                    toast.error(`Błąd: ${error}`);
            }

            dispatch(clearActionStatus());
        }
    }, [error, lastActionType, dispatch]);

    // Added effect to update due date when issue date changes
    useEffect(() => {
        const subscription = formMethods.watch((value, { name }) => {
            if (name === 'issueDate') {
                // Get current values
                const issueDate = value.issueDate;
                const currentDueDate = value.dateDue;

                // If due date is before issue date, update it
                if (issueDate && currentDueDate && currentDueDate < issueDate) {
                    // Check type and cast to DateTime
                    if ('plus' in issueDate) {
                        // Use safe access to plus method
                        formMethods.setValue('dateDue', (issueDate as DateTime).plus({ days: 14 }));
                    } else {
                        // Alternative approach for other date types
                        const newDate = new Date(issueDate as string | number | Date);
                        newDate.setDate(newDate.getDate() + 14);
                        formMethods.setValue('dateDue', DateTime.fromJSDate(newDate));
                    }
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
                    {/* Section with basic data */}
                    <InvoiceBasicInfo
                        control={formMethods.control}
                        errors={formMethods.formState.errors}
                        contractors={contractors}
                        getValues={formMethods.getValues}
                    />

                    {/* Section with invoice items */}
                    <InvoiceItemsTable
                        control={formMethods.control as any}
                        errors={formMethods.formState.errors}
                        fields={fields}
                        remove={remove}
                        handleAddItem={handleAddItem}
                        watchedItems={watchedItems}
                        forceUpdate={forceUpdate}
                    />

                    {/* Section with summary */}
                    <InvoiceSummary
                        totals={totals}
                        control={formMethods.control}
                        paidAmount={formMethods.watch('paidAmount') || 0}
                        key={`summary-${updateCounter}`}
                        disabled={loading} // Dodajemy wyłączenie edycji podczas ładowania
                    />

                    {/* Action buttons */}
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