import {API_URL, getHeaders} from '../core';

export const getPurchasesByUser = async (
    token: string
): Promise<PurchaseDetailsDTO[]> => {

    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${API_URL}/parking-history/purchases/my`,
        {
            method: 'GET',
            headers: {
                ...getHeaders(),
                Authorization: `Bearer ${token}`,
            },

        }
    );

    if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Failed to fetch purchases: ${response.status} ${responseBody}`);
    }

    return response.json();
};