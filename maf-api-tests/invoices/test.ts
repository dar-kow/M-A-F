import { test, expect } from '@playwright/test';
import { InvoiceActions } from './actions';
import { ContractorActions } from '../contractors/actions';
import { PaymentStatus } from '../common/types';

const API_BASE_URL = 'http://localhost:5005';
const MASS_DATA_COUNT = 50;

test.describe('Invoice API Tests', () => {
    let contractorId: number;

    test.beforeAll(async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);
        const result = await api.createContractor();
        contractorId = result.data.id;
    });

    test('should create a new invoice', async ({ request }) => {
        const api = new InvoiceActions(request, API_BASE_URL);
        const result = await api.createInvoice(contractorId);

        if (result.status !== 201) {
            console.error('Failed to create invoice:', result.data);
            if (result.data?.error) {
                console.error('Error details:', result.data.message);
            }
        }

        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('id');
        expect(result.data.number).toBe(result.requestData.number);
        expect(result.data.contractorId).toBe(contractorId);
    });

    test('should get an invoice by ID', async ({ request }) => {
        const api = new InvoiceActions(request, API_BASE_URL);

        const createResult = await api.createInvoice(contractorId);
        expect(createResult.status).toBe(201);

        const invoiceId = createResult.data.id;
        const getResult = await api.getInvoiceById(invoiceId);

        expect(getResult.status).toBe(200);
        expect(getResult.data).toHaveProperty('id', invoiceId);
        expect(getResult.data).toHaveProperty('invoiceItems');
        expect(Array.isArray(getResult.data.invoiceItems)).toBeTruthy();
    });

    test('should update an invoice', async ({ request }) => {
        const api = new InvoiceActions(request, API_BASE_URL);

        const createResult = await api.createInvoice(contractorId);
        expect(createResult.status).toBe(201);

        const invoiceId = createResult.data.id;
        const originalInvoice = createResult.data;

        const updatedInvoice = {
            ...originalInvoice,
            description: 'Updated description',
            paymentStatus: PaymentStatus.Paid,
            paidAmount: originalInvoice.totalAmount
        };

        const updateResult = await api.updateInvoice(invoiceId, updatedInvoice);
        expect(updateResult.status).toBe(204);

        const getResult = await api.getInvoiceById(invoiceId);
        expect(getResult.status).toBe(200);
        expect(getResult.data.description).toBe(updatedInvoice.description);
        expect(getResult.data.paymentStatus).toBe(PaymentStatus.Paid);
        expect(getResult.data.paidAmount).toBe(updatedInvoice.paidAmount);
    });

    test('should delete an invoice', async ({ request }) => {
        const api = new InvoiceActions(request, API_BASE_URL);

        const createResult = await api.createInvoice(contractorId);
        expect(createResult.status).toBe(201);

        const invoiceId = createResult.data.id;

        const deleteResult = await api.deleteInvoice(invoiceId);
        expect(deleteResult.status).toBe(204);

        const getResult = await api.getInvoiceById(invoiceId);
        expect(getResult.status).toBe(404);
    });

    test('Mass create invoices for database population', async ({ request }) => {
        const api = new InvoiceActions(request, API_BASE_URL);
        const contractorApi = new ContractorActions(request, API_BASE_URL);

        let contractorIds: number[] = [];
        const getContractorsResult = await contractorApi.getAllContractors();

        if (getContractorsResult.status === 200 && Array.isArray(getContractorsResult.data)) {
            contractorIds = getContractorsResult.data.map(c => c.id);
        }

        if (contractorIds.length < 5) {
            const newContractors = await contractorApi.createMultipleContractors(10);
            contractorIds = [...contractorIds, ...newContractors.map(c => c.id).filter((id): id is number => id !== undefined)];
        }

        const createdInvoices = await api.createMultipleInvoices(contractorIds, MASS_DATA_COUNT);

        expect(createdInvoices.length).toBe(MASS_DATA_COUNT);
        for (const invoice of createdInvoices) {
            expect(invoice).toHaveProperty('id');
        }
    });
});