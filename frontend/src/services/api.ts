import axios, { AxiosInstance, AxiosResponse } from "axios";
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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

  public createInvoice(invoiceData: any): Promise<AxiosResponse> {
    return this.axiosInstance.post("/invoices", invoiceData);
  }

  public updateInvoice(id: number, invoiceData: any): Promise<AxiosResponse> {
    return this.axiosInstance.put(`/invoices/${id}`, invoiceData);
  }

  public deleteInvoice(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.delete(`/invoices/${id}`);
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

  public createContractor(contractorData: any): Promise<AxiosResponse> {
    return this.axiosInstance.post("/contractors", contractorData);
  }

  public updateContractor(id: number, contractorData: any): Promise<AxiosResponse> {
    return this.axiosInstance.put(`/contractors/${id}`, contractorData);
  }

  public deleteContractor(id: number): Promise<AxiosResponse> {
    return this.axiosInstance.delete(`/contractors/${id}`);
  }
}

export default new ApiService();