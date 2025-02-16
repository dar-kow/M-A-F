import { jsPDF } from "jspdf";
import { Invoice } from "../types/types";
import { formatMoney } from "./formatMoney";
import { getPaymentMethodDisplay } from "./getPaymentMethodDisplay";
import { getPaymentStatusDisplay } from "./getPaymentStatusDisplay";
// ...existing imports...

export function printInvoicePDF(invoice: Invoice, contractorName: string) {
  const doc = new jsPDF();

  // Register and set font (using helvetica for testing)
  // If a Polish supporting font is registered, use it instead.
  /*
  registerOpenSans(doc);
  doc.setFont("OpenSans", "normal");
  */
  doc.setFont("helvetica", "normal");

  // ----- Header Section -----
  // Draw header background and title.
  doc.setFillColor(230, 230, 250);
  doc.rect(14, 10, 182, 20, "F");
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 128);
  doc.text("Faktura VAT", 20, 23);
  // Invoice number in header (right aligned)
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Nr ${invoice.number}`, 180, 18, { align: "right" });
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);

  // ----- Date and Payment Method Section -----
  doc.setFontSize(12);
  const dateText = `Data wystawienia: ${new Date(invoice.date).toLocaleDateString("pl-PL")}`;
  doc.text(dateText, 14, 42);
  if (invoice.dueDate) {
    const dueText = `Termin płatności: ${new Date(invoice.dueDate).toLocaleDateString("pl-PL")}`;
    doc.text(dueText, 14, 50);
  }
  const statusText = `Status płatności: ${getPaymentStatusDisplay(invoice.paymentStatus)}`;
  doc.text(statusText, 14, 58);
  const methodText = `Metoda płatności: ${getPaymentMethodDisplay(invoice.paymentMethod)}`;
  doc.text(methodText, 14, 66);

  // ----- Seller and Buyer Information Section -----
  // Draw boxes for seller and buyer details.
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.rect(14, 75, 85, 35); // Seller box
  doc.rect(105, 75, 85, 35); // Buyer box

  // Seller Information
  doc.setFontSize(10);
  doc.text("Sprzedawca:", 16, 82);
  doc.setFontSize(12);
  doc.text("Firma Sprzedawcy", 16, 90);
  doc.text("ul. Sprzedawcza 1", 16, 98);
  doc.text("00-001 Warszawa", 16, 106);
  doc.text("NIP: 111-222-33-44", 16, 114);

  // Buyer Information
  doc.setFontSize(10);
  doc.text("Nabywca:", 107, 82);
  doc.setFontSize(12);
  doc.text(contractorName || "-", 107, 90);
  // Additional buyer details
  doc.text("ul. Kupiecka 11", 107, 98);
  doc.text("11-111 Miasto", 107, 106);
  doc.text("NIP: 555-666-77-88", 107, 114);

  // ----- Invoice Details Section -----
  const detailsY = 120;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(14, detailsY, 196, detailsY);
  doc.setFontSize(12);
  doc.text(
    `Łączna wartość faktury: ${formatMoney(invoice.amount)}`,
    14,
    detailsY + 10,
  );

  // ----- Summary and Signature Section -----
  const summaryY = detailsY + 25;
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(14, summaryY - 5, 196, summaryY - 5);
  doc.setFontSize(14);
  doc.text(`Razem do zapłaty: ${formatMoney(invoice.amount)}`, 14, summaryY);
  // Signature placeholder
  doc.setFontSize(12);
  doc.text("Podpis wystawcy:", 14, summaryY + 20);
  doc.line(50, summaryY + 18, 120, summaryY + 18);

  // ----- Footer Section -----
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Wygenerowano za pomocą InvoiceApp", 105, 285, { align: "center" });

  // Save the PDF with the invoice number as part of the filename
  doc.save(`Faktura_${invoice.number}.pdf`);
}
