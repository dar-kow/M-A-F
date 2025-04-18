import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import { RootState } from '../../../../../store/rootReducer';
import {
    fetchInvoiceRequest,
    createInvoiceRequest,
    updateInvoiceRequest,
    clearInvoice,
    clearErrors,
    fetchLastInvoiceNumberRequest
} from '../../../redux/invoiceActions';
import useFetchContractors from '../../../../contractors/hooks/useFetchContractors';
import { PaymentMethod, PaymentStatus, VatRate, Unit, Invoice, InvoiceItem } from '@app-types/types';
import { useInvoiceTotals } from './useInvoiceTotals';

// Stałe
const emptyItem = {
    description: '',
    quantity: 1,
    unitPrice: 0,
    unit: Unit.szt,
    vatRate: VatRate.TwentyThree,
};

// Typy
export type FormData = {
    invoiceNumber: string;
    issueDate: DateTime;
    dateDue: DateTime;
    contractorId: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    description: string;
    paidAmount: number;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        unit: Unit;
        vatRate: VatRate;
    }[];
};

export function useInvoiceForm(isEdit: boolean, invoiceId?: number) {
    const [updateCounter, setUpdateCounter] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const invoice = useSelector((state: RootState) => state.invoices.currentInvoice);
    const lastInvoiceNumber = useSelector((state: RootState) => state.invoices.lastInvoiceNumber);

    // Kontrahenci
    const { contractors } = useFetchContractors();

    // Funkcja do wymuszenia przeliczenia
    const forceUpdate = useCallback(() => {
        setUpdateCounter(prev => prev + 1);
    }, []);

    // Inicjalizacja formularza
    const formMethods = useForm<FormData>({
        defaultValues: {
            invoiceNumber: '',
            issueDate: DateTime.now(),
            dateDue: DateTime.now().plus({ days: 14 }),
            contractorId: 0,
            paymentMethod: PaymentMethod.Transfer,
            paymentStatus: PaymentStatus.Unpaid,
            description: '',
            paidAmount: 0,
            items: [{ ...emptyItem }]
        }
    });

    const { control, reset, watch, setValue } = formMethods;

    // Konfiguracja dynamicznej tablicy pozycji faktury
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    // Obserwowanie pozycji faktury
    const watchedItems = watch('items');

    // Obliczanie sum
    const totals = useInvoiceTotals(watchedItems);

    // Effect dla obserwacji zmian w polach
    useEffect(() => {
        // To wymusza przeliczenie wartości po każdej zmianie w items
        const subscription = formMethods.watch((_, { name }) => {
            // Jeśli zmiana dotyczy pozycji faktury
            if (name?.startsWith('items.') && (
                name.includes('.quantity') ||
                name.includes('.unitPrice') ||
                name.includes('.vatRate')
            )) {
                // Wymuszamy rerender przez niewielką aktualizację stanu
                forceUpdate();
            }
        });

        return () => subscription.unsubscribe();
    }, [formMethods, forceUpdate]);

    // Effect do debugowania zmian
    useEffect(() => {
        console.log('Items updated or updateCounter changed:', watchedItems, 'Counter:', updateCounter);
    }, [watchedItems, updateCounter]);

    // Pobierz ostatni numer faktury przy inicjalizacji
    useEffect(() => {
        if (!isEdit) {
            dispatch(fetchLastInvoiceNumberRequest());
        }
    }, [dispatch, isEdit]);

    // Ustaw automatycznie numer faktury dla nowej faktury
    useEffect(() => {
        if (!isEdit && lastInvoiceNumber && !watch('invoiceNumber')) {
            try {
                const currentDate = DateTime.now();
                const year = currentDate.year;

                // Domyślny numer na wypadek błędu
                let nextNumber = 1;

                // Analizuj ostatni numer faktury
                if (lastInvoiceNumber) {
                    console.log('Ostatni numer faktury z API:', lastInvoiceNumber);
                    // Format: FV/numer/rok
                    const regex = /FV\/(\d+)\/(\d+)/;
                    const match = lastInvoiceNumber.match(regex);

                    if (match && match[1]) {
                        nextNumber = parseInt(match[1], 10) + 1;
                    }
                } else {
                    console.log('Brak ostatniego numeru faktury - używam domyślnego 1');
                }

                // Formatuj nowy numer
                const newInvoiceNumber = `FV/${nextNumber}/${year}`;
                console.log('Wygenerowano nowy numer faktury:', newInvoiceNumber);

                // Ustaw nowy numer faktury
                setValue('invoiceNumber', newInvoiceNumber);
            } catch (error) {
                console.error('Błąd podczas generowania numeru faktury:', error);
                // Ustaw awaryjny numer faktury
                const fallbackNumber = `FV/1/${DateTime.now().year}`;
                setValue('invoiceNumber', fallbackNumber);
            }
        }
    }, [lastInvoiceNumber, isEdit, setValue, watch]);

    // Ładowanie danych faktury do edycji
    useEffect(() => {
        if (isEdit && invoiceId) {
            dispatch(fetchInvoiceRequest(invoiceId));
        }

        return () => {
            dispatch(clearInvoice());
            dispatch(clearErrors());
        };
    }, [dispatch, isEdit, invoiceId]);

    // Wypełnianie formularza danymi faktury
    useEffect(() => {
        if (isEdit && invoice && invoice.invoiceItems) {
            console.log('Dane faktury z API:', invoice);

            // Funkcja pomocnicza do bezpiecznej konwersji dat
            const safeToDateTime = (date: any) => {
                if (!date) return DateTime.now();

                try {
                    if (date instanceof Date) {
                        return DateTime.fromJSDate(date);
                    }

                    if (typeof date === 'string') {
                        // Próba parsowania jako string ISO
                        const dt = DateTime.fromISO(date);
                        if (dt.isValid) return dt;

                        // Jeśli ISO nie zadziała, spróbuj z normalnym konstruktorem Date
                        return DateTime.fromJSDate(new Date(date));
                    }

                    return DateTime.now();
                } catch (error) {
                    console.error('Błąd konwersji daty:', error);
                    return DateTime.now();
                }
            };

            // Użyj funkcji pomocniczej do bezpiecznej konwersji dat
            const issueDateObj = safeToDateTime(invoice.issueDate);
            const dueDateObj = safeToDateTime(invoice.dueDate);

            console.log('Skonwertowane do DateTime:', {
                issueDate: issueDateObj.toISO(),
                dueDate: dueDateObj.toISO()
            });

            reset({
                invoiceNumber: invoice.number,
                issueDate: issueDateObj,
                dateDue: dueDateObj,
                contractorId: invoice.contractorId,
                paymentMethod: invoice.paymentMethod,
                paymentStatus: invoice.paymentStatus,
                description: invoice.description || '',
                paidAmount: invoice.paidAmount || 0,
                items: invoice.invoiceItems.map(item => ({
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.netPrice,
                    unit: item.unit,
                    vatRate: item.vatRate
                }))
            });

            // Wymuszenie przeliczenia po załadowaniu danych
            forceUpdate();
        }
    }, [reset, invoice, isEdit, forceUpdate]);

    // Obsługa dodawania pozycji
    const handleAddItem = useCallback(() => {
        append({ ...emptyItem });
        // Wymuszenie przeliczenia po dodaniu pozycji
        setTimeout(forceUpdate, 0);
    }, [append, forceUpdate]);

    // Obsługa anulowania
    const handleCancel = useCallback(() => {
        navigate('/invoices');
    }, [navigate]);

    // Obsługa zapisu formularza
    const handleSubmit = useCallback((data: FormData) => {
        // Aktualizacja statusu płatności na podstawie zapłaconej kwoty
        let paymentStatus = data.paymentStatus;
        if (data.paidAmount <= 0) {
            paymentStatus = PaymentStatus.Unpaid;
        } else if (data.paidAmount >= totals.grossTotal) {
            paymentStatus = PaymentStatus.Paid;
        } else {
            paymentStatus = PaymentStatus.PartiallyPaid;
        }

        // Przygotowanie danych do wysłania
        const invoiceData: Partial<Invoice> = {
            number: data.invoiceNumber,
            issueDate: data.issueDate.toJSDate(),
            dueDate: data.dateDue.toJSDate(),
            contractorId: data.contractorId,
            paymentMethod: data.paymentMethod,
            description: data.description,
            paidAmount: data.paidAmount,
            totalAmount: totals.grossTotal,
            // netAmount: totals.netTotal,
            // vatAmount: totals.vatTotal,
            invoiceItems: data.items.map((item, index) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                unit: item.unit,
                vatRate: item.vatRate,
                netValue: item.quantity * item.unitPrice,
                vatValue: item.quantity * item.unitPrice * (item.vatRate / 100),
                grossValue: item.quantity * item.unitPrice * (1 + item.vatRate / 100),
                lineNumber: index + 1,
                netPrice: item.unitPrice,
                invoiceId: isEdit && invoiceId ? invoiceId : 0
            }) as InvoiceItem)
        };

        if (isEdit && invoiceId) {
            dispatch(updateInvoiceRequest({
                ...invoiceData,
                id: invoiceId,
                createdAt: invoice?.issueDate || new Date().toISOString()
            } as Invoice));
        } else {
            dispatch(createInvoiceRequest({
                ...invoiceData,
                createdAt: new Date().toISOString()
            } as Invoice));
        }
    }, [totals, isEdit, invoiceId, invoice, dispatch]);

    return {
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
    };
}