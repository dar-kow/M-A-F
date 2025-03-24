import { faker } from '@faker-js/faker';
import { Invoice, InvoiceItem, PaymentMethod, PaymentStatus, Unit, VatRate } from '../common/types';

export class InvoiceData {
    static generateRandomInvoice(contractorId: number): Invoice {
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        return {
            number: `FV/${faker.number.int({ min: 1, max: 9999 })}/${new Date().getFullYear()}`,
            issueDate: issueDate.toISOString(),
            dueDate: dueDate.toISOString(),
            totalAmount: 0,
            paymentStatus: this.getRandomPaymentStatus(),
            paidAmount: 0,
            description: faker.commerce.productDescription(),
            contractorId: contractorId,
            paymentMethod: this.getRandomPaymentMethod(),
            invoiceItems: this.generateRandomInvoiceItems(faker.number.int({ min: 1, max: 5 }))
        };
    }

    static generateRandomInvoiceItems(count: number): InvoiceItem[] {
        const items: InvoiceItem[] = [];
        for (let i = 0; i < count; i++) {
            const quantity = faker.number.float({ min: 1, max: 10, fractionDigits: 2 });
            const netPrice = faker.number.float({ min: 10, max: 1000, fractionDigits: 2 });

            items.push({
                lineNumber: i + 1,
                description: faker.commerce.productName(),
                quantity: quantity,
                unit: this.getRandomUnit(),
                vatRate: this.getRandomVatRate(),
                netPrice: netPrice
            });
        }
        return items;
    }

    static calculateInvoiceTotals(invoice: Invoice): Invoice {
        let totalNet = 0;
        let totalVat = 0;

        for (const item of invoice.invoiceItems) {
            const itemNet = item.quantity * item.netPrice;
            let vatRateValue = 0;

            switch (item.vatRate) {
                case VatRate.Zero: vatRateValue = 0; break;
                case VatRate.Three: vatRateValue = 3; break;
                case VatRate.Five: vatRateValue = 5; break;
                case VatRate.Eight: vatRateValue = 8; break;
                case VatRate.TwentyThree: vatRateValue = 23; break;
            }

            const itemVat = itemNet * (vatRateValue / 100);
            totalNet += itemNet;
            totalVat += itemVat;
        }

        const totalGross = totalNet + totalVat;
        invoice.totalAmount = parseFloat(totalGross.toFixed(2));

        if (invoice.paymentStatus === PaymentStatus.Paid) {
            invoice.paidAmount = invoice.totalAmount;
        } else if (invoice.paymentStatus === PaymentStatus.PartiallyPaid) {
            invoice.paidAmount = parseFloat((invoice.totalAmount * faker.number.float({ min: 0.1, max: 0.9, fractionDigits: 2 })).toFixed(2));
        } else {
            invoice.paidAmount = 0;
        }

        return invoice;
    }

    static generateNextInvoiceNumber(lastNumber: string): string {
        const parts = lastNumber.split('/');
        if (parts.length === 3) {
            const prefix = parts[0];
            const number = parseInt(parts[1], 10);
            const year = parts[2];
            return `${prefix}/${number + 1}/${year}`;
        }
        const currentYear = new Date().getFullYear();
        return `FV/1/${currentYear}`;
    }

    private static getRandomPaymentMethod(): PaymentMethod {
        const methods = [
            PaymentMethod.Cash,
            PaymentMethod.Transfer,
            PaymentMethod.Card,
            PaymentMethod.Other
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    private static getRandomPaymentStatus(): PaymentStatus {
        const statuses = [
            PaymentStatus.Paid,
            PaymentStatus.PartiallyPaid,
            PaymentStatus.Unpaid,
            PaymentStatus.Overdue
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    private static getRandomVatRate(): VatRate {
        const rates = [
            VatRate.Zero,
            VatRate.Three,
            VatRate.Five,
            VatRate.Eight,
            VatRate.TwentyThree
        ];
        return rates[Math.floor(Math.random() * rates.length)];
    }

    private static getRandomUnit(): Unit {
        const units = [Unit.l, Unit.szt, Unit.m, Unit.kg];
        return units[Math.floor(Math.random() * units.length)];
    }
}