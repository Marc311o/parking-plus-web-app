import {API_URL, getHeaders} from '../core';
import type {ParkingSpaceStats} from './types';

export const getParkingSpaceOccupancy = async (): Promise<ParkingSpaceStats> => {
    const response = await fetch(`${API_URL}/parking-spaces/occupancy`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch parking occupancy. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};