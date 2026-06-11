import {API_URL, getHeaders} from '../core';

export const getDailyRevenue = async (date: string): Promise<number> => {
    const response = await fetch(
        `${API_URL}/parking-history/daily-revenue?date=${date}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );


    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch daily revenue. Status: ${response.status}. Body: ${errorText}`
        );
    }

    return response.json();
};