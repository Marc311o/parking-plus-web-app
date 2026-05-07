import {API_URL, getHeaders} from '../core';
import type {
    AverageStayPeriod,
    AverageStayResponse,
    EntriesPeriod,
    EntriesResponse,
    ParkingFloor,
    ParkingSpaceRankingResponse,
    RevenuePeriod,
    RevenueResponse,
} from './types';

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

export const getRevenueStats = async (
    date: string,
    period: RevenuePeriod
): Promise<RevenueResponse> => {
    const params = new URLSearchParams();

    params.set('date', date);
    params.set('period', period);

    const response = await fetch(
        `${API_URL}/parking-history/revenue-stats?${params.toString()}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch revenue stats. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};

export const getAverageStayStats = async (
    date: string,
    period: AverageStayPeriod
): Promise<AverageStayResponse> => {
    const params = new URLSearchParams();

    params.set('date', date);
    params.set('period', period);

    const response = await fetch(
        `${API_URL}/parking-history/average-stay?${params.toString()}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch average stay stats. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};

export const getParkingSpaceRanking = async (
    date: string,
    floor: ParkingFloor
): Promise<ParkingSpaceRankingResponse> => {
    const params = new URLSearchParams();

    params.set('date', date);
    params.set('floor', floor);

    const response = await fetch(
        `${API_URL}/parking-history/ranking?${params.toString()}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch parking space ranking. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};