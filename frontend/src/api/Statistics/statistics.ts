import {API_URL, getHeaders} from '../core';
import type {EntriesPeriod, EntriesResponse} from './types';

export const getEntriesStats = async (
    date: string,
    period: EntriesPeriod
): Promise<EntriesResponse> => {
    const params = new URLSearchParams();

    params.set('date', date);
    params.set('period', period);

    const response = await fetch(
        `${API_URL}/parking-history/entries-stats?${params.toString()}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch entries stats. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};