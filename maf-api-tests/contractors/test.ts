import { test, expect } from '@playwright/test';
import { ContractorActions } from './actions';

const API_BASE_URL = 'http://localhost:5005';
const MASS_DATA_COUNT = 50;

test.describe('Contractor API Tests', () => {
    test('should create a new contractor', async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);
        const result = await api.createContractor();

        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('id');
        expect(result.data.name).toContain(result.requestData.name);
    });

    test('should get a contractor by ID', async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);

        const createResult = await api.createContractor();
        expect(createResult.status).toBe(201);

        const contractorId = createResult.data.id;
        const getResult = await api.getContractorById(contractorId);

        expect(getResult.status).toBe(200);
        expect(getResult.data).toHaveProperty('id', contractorId);
    });

    test('should update a contractor', async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);

        const createResult = await api.createContractor();
        expect(createResult.status).toBe(201);

        const contractorId = createResult.data.id;
        const originalContractor = createResult.data;

        const updatedData = {
            ...originalContractor,
            name: 'Updated ' + originalContractor.name,
            email: 'updated.' + originalContractor.email
        };

        const updateResult = await api.updateContractor(contractorId, updatedData);
        expect(updateResult.status).toBe(204);

        const getResult = await api.getContractorById(contractorId);
        expect(getResult.status).toBe(200);
        expect(getResult.data.name).toBe(updatedData.name);
        expect(getResult.data.email).toBe(updatedData.email);
    });

    test('should delete a contractor', async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);

        const createResult = await api.createContractor();
        expect(createResult.status).toBe(201);

        const contractorId = createResult.data.id;

        const deleteResult = await api.deleteContractor(contractorId);
        expect(deleteResult.status).toBe(204);

        const getResult = await api.getContractorById(contractorId);
        expect(getResult.status).toBe(404);
    });

    test('Mass create contractors for database population', async ({ request }) => {
        const api = new ContractorActions(request, API_BASE_URL);
        const createdContractors = await api.createMultipleContractors(MASS_DATA_COUNT);

        expect(createdContractors.length).toBe(MASS_DATA_COUNT);
        for (const contractor of createdContractors) {
            expect(contractor).toHaveProperty('id');
        }
    });
});