import { APIRequestContext } from '@playwright/test';
import { Invoice } from '../common/types';
import { InvoiceData } from './data';
import { ApiBase } from '../common/api-base';

export class InvoiceActions extends ApiBase {
    constructor(request: APIRequestContext, baseUrl: string) {
        super(request, baseUrl);
    }

    async getAllInvoices() {
        const response = await this.request.get(`${this.baseUrl}/api/Invoices`);
        return this.handleResponse(response);
    }

    async getInvoiceById(id: number) {
        const response = await this.request.get(`${this.baseUrl}/api/Invoices/${id}`);
        return this.handleResponse(response);
    }

    async getLastInvoiceNumber() {
        const response = await this.request.get(`${this.baseUrl}/api/Invoices/last-number`);
        let data;

        try {
            data = await response.json();
        } catch (error) {
            data = await response.text();
        }

        return {
            status: response.status(),
            data: data
        };
    }

    async createInvoice(contractorId: number, invoiceData?: Invoice) {
        let data: Invoice;

        const lastNumberResult = await this.getLastInvoiceNumber();
        let nextNumber = "FV/1/" + new Date().getFullYear();

        if (lastNumberResult.status === 200 && lastNumberResult.data) {
            const parts = lastNumberResult.data.split('/');
            if (parts.length === 3) {
                const prefix = parts[0];
                const number = parseInt(parts[1], 10);
                const year = parts[2];
                nextNumber = `${prefix}/${number + 1}/${year}`;
            }
        }

        if (invoiceData) {
            data = { ...invoiceData };
            data.number = nextNumber;
        } else {
            data = InvoiceData.generateRandomInvoice(contractorId);
            data.number = nextNumber;
            data = InvoiceData.calculateInvoiceTotals(data);
        }

        (data as any).createdAt = new Date().toISOString();

        // console.log('Creating invoice with payload:', JSON.stringify(data, null, 2));

        const response = await this.request.post(`${this.baseUrl}/api/Invoices`, {
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await this.handleResponse(response);
        return {
            ...result,
            requestData: data
        };
    }

    async updateInvoice(id: number, invoiceData: Invoice) {
        const response = await this.request.put(`${this.baseUrl}/api/Invoices/${id}`, {
            data: invoiceData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await this.handleResponse(response);
        return {
            ...result,
            data: result.status === 204 ? invoiceData : result.data,
            requestData: invoiceData
        };
    }

    async deleteInvoice(id: number) {
        const response = await this.request.delete(`${this.baseUrl}/api/Invoices/${id}`);
        return this.handleResponse(response);
    }

    async getInvoiceItems(invoiceId: number) {
        const response = await this.request.get(`${this.baseUrl}/api/InvoiceItems?invoiceId=${invoiceId}`);
        return this.handleResponse(response);
    }

    async createMultipleInvoices(contractorIds: number[], count: number, month?: number, year?: number) {
        const createdInvoices: Invoice[] = [];
        const now = new Date();
        const targetMonth = typeof month === 'number' ? month : now.getMonth(); // 0 = styczeń
        const targetYear = typeof year === 'number' ? year : now.getFullYear();

        // Ustal liczbę dni w miesiącu
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * contractorIds.length);
            const contractorId = contractorIds[randomIndex];

            const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
            const issueDate = new Date(targetYear, targetMonth, randomDay);
            const dueDate = new Date(issueDate);
            dueDate.setDate(issueDate.getDate() + 14);

            let invoiceData = InvoiceData.generateRandomInvoice(contractorId);
            invoiceData.issueDate = issueDate.toISOString();
            invoiceData.dueDate = dueDate.toISOString();
            invoiceData.createdAt = issueDate.toISOString();
            invoiceData = InvoiceData.calculateInvoiceTotals(invoiceData);

            const result = await this.createInvoice(contractorId, invoiceData);
            if (result.status === 201) {
                createdInvoices.push(result.data);
            }
        }

        return createdInvoices;
    }
}