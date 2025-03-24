import { test, expect } from '@playwright/test';
import { InvoiceActions } from './actions';
import { ContractorActions } from '../contractors/actions';
import { PaymentStatus } from '../common/types';
import { InvoiceData } from './data';

const API_BASE_URL = 'http://localhost:5005';

test.describe('Complex Invoice Scenarios', () => {
    test('should handle an invoice with multiple items with different VAT rates', async ({ request }) => {
        const invoiceApi = new InvoiceActions(request, API_BASE_URL);
        const contractorApi = new ContractorActions(request, API_BASE_URL);

        const createContractorResult = await contractorApi.createContractor();
        const contractorId = createContractorResult.data.id;

        const invoiceData = InvoiceData.generateRandomInvoice(contractorId);
        const createResult = await invoiceApi.createInvoice(contractorId, invoiceData);

        expect(createResult.status).toBe(201);
        expect(createResult.data).toHaveProperty('id');

        const invoiceId = createResult.data.id;
        const itemsResult = await invoiceApi.getInvoiceItems(invoiceId);

        expect(itemsResult.status).toBe(200);
        expect(Array.isArray(itemsResult.data)).toBeTruthy();
    });

    test('should handle invoice payment status changes', async ({ request }) => {
        const invoiceApi = new InvoiceActions(request, API_BASE_URL);
        const contractorApi = new ContractorActions(request, API_BASE_URL);

        const createContractorResult = await contractorApi.createContractor();
        const contractorId = createContractorResult.data.id;

        const invoiceData = InvoiceData.generateRandomInvoice(contractorId);
        invoiceData.paymentStatus = PaymentStatus.Unpaid;
        invoiceData.paidAmount = 0;

        const createResult = await invoiceApi.createInvoice(contractorId, invoiceData);
        expect(createResult.status).toBe(201);

        const invoiceId = createResult.data.id;

        const partialInvoice = {
            ...createResult.data,
            paymentStatus: PaymentStatus.PartiallyPaid,
            paidAmount: createResult.data.totalAmount / 2
        };

        const partialResult = await invoiceApi.updateInvoice(invoiceId, partialInvoice);
        expect(partialResult.status).toBe(204);

        const getPartialResult = await invoiceApi.getInvoiceById(invoiceId);
        expect(getPartialResult.data.paymentStatus).toBe(PaymentStatus.PartiallyPaid);

        const paidInvoice = {
            ...getPartialResult.data,
            paymentStatus: PaymentStatus.Paid,
            paidAmount: getPartialResult.data.totalAmount
        };

        const paidResult = await invoiceApi.updateInvoice(invoiceId, paidInvoice);
        expect(paidResult.status).toBe(204);

        const getPaidResult = await invoiceApi.getInvoiceById(invoiceId);
        expect(getPaidResult.data.paymentStatus).toBe(PaymentStatus.Paid);
        expect(getPaidResult.data.paidAmount).toBe(getPaidResult.data.totalAmount);
    });
});