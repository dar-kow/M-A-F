import { APIRequestContext } from '@playwright/test';

export class ApiBase {
    protected readonly request: APIRequestContext;
    protected readonly baseUrl: string;

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request;
        this.baseUrl = baseUrl;
    }

    protected async handleResponse(response: any) {
        const status = response.status();
        let responseData;

        try {
            if (status >= 200 && status < 300) {
                if (status === 204) {
                    responseData = null;
                } else {
                    responseData = await response.json();
                }
            } else {
                const errorText = await response.text();
                console.error(`API Error (${status}):`, errorText);
                responseData = {
                    error: true,
                    statusCode: status,
                    message: errorText.substring(0, 500)
                };
            }
        } catch (error) {
            const textContent = await response.text();
            console.error('Failed to parse response:', textContent);
            responseData = {
                error: true,
                message: `Failed to parse JSON: ${textContent.substring(0, 200)}...`,
                parseError: error.message
            };
        }

        return {
            status,
            data: responseData
        };
    }
}