/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Contractor, Invoice } from "@/types/types";

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5005/api";
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
    });
  }

  // ---------------------------
  // Endpoints for Invoices
  // ---------------------------
  public getInvoices(): Promise<AxiosResponse> {
    return this.axiosInstance.get("/invoices");
  }

  public getInvoice(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.get(`/invoices/${id}`);
  }

  public createInvoice(invoice: Invoice): Promise<AxiosResponse> {
    return this.axiosInstance.post("/invoices", invoice);
  }

  public updateInvoice(id: number, invoice: Invoice): Promise<AxiosResponse> {
    return this.axiosInstance.put(`/invoices/${id}`, invoice);
  }

  public deleteInvoice(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.delete(`/invoices/${id}`);
  }

  public getLastInvoiceNumber(): Promise<AxiosResponse> {
    return this.axiosInstance.get("/invoices/last-number");
  }

  public updateInvoicePayment(id: number, paidAmount: number): Promise<AxiosResponse> {
    return this.axiosInstance.put(`/invoices/${id}/payment`, { paidAmount });
  }

  // ---------------------------
  // Endpoints for Invoice Items
  // ---------------------------
  public getInvoiceItems(invoiceId: number): Promise<AxiosResponse> {
    return this.axiosInstance.get("/InvoiceItems", {
      params: { invoiceId },
    });
  }

  // ---------------------------
  // Endpoints for Contractors
  // ---------------------------
  public getContractors(): Promise<AxiosResponse> {
    return this.axiosInstance.get("/contractors");
  }

  public getContractor(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.get(`/contractors/${id}`);
  }

  public createContractor(contractor: Contractor): Promise<AxiosResponse> {
    return this.axiosInstance.post("/contractors", contractor);
  }

  public updateContractor(id: number, contractor: Contractor): Promise<AxiosResponse> {
    return this.axiosInstance.put(`/contractors/${id}`, contractor);
  }

  public deleteContractor(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.delete(`/contractors/${id}`);
  }
}

export default new ApiService();