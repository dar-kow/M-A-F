import { APIRequestContext } from '@playwright/test';
import { Contractor } from '../common/types';
import { ContractorData } from './data';
import { ApiBase } from '../common/api-base';

export class ContractorActions extends ApiBase {
    constructor(request: APIRequestContext, baseUrl: string) {
        super(request, baseUrl);
    }

    async getAllContractors() {
        const response = await this.request.get(`${this.baseUrl}/api/Contractors`);
        return this.handleResponse(response);
    }

    async getContractorById(id: number) {
        const response = await this.request.get(`${this.baseUrl}/api/Contractors/${id}`);
        return this.handleResponse(response);
    }

    async createContractor(contractorData?: Contractor) {
        const data = contractorData || ContractorData.generateRandomContractor();
        const response = await this.request.post(`${this.baseUrl}/api/Contractors`, {
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

    async updateContractor(id: number, contractorData: Contractor) {
        const response = await this.request.put(`${this.baseUrl}/api/Contractors/${id}`, {
            data: contractorData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await this.handleResponse(response);
        return {
            ...result,
            data: result.status === 204 ? contractorData : result.data,
            requestData: contractorData
        };
    }

    async deleteContractor(id: number) {
        const response = await this.request.delete(`${this.baseUrl}/api/Contractors/${id}`);
        return this.handleResponse(response);
    }

    async createMultipleContractors(count: number) {
        const createdContractors: Contractor[] = [];

        for (let i = 0; i < count; i++) {
            const result = await this.createContractor();
            if (result.status === 201) {
                createdContractors.push(result.data);
            }
        }

        return createdContractors;
    }
}