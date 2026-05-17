import type { VehicleDTO } from './types';
import { API_URL, getHeaders } from '../core';

export const getVehiclesByOwner = async (
    ownerId: string
): Promise<VehicleDTO[]> => {

    const response = await fetch(
        `${API_URL}/vehicles/owner/${ownerId}`,
        {
            method: 'GET',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch vehicles: ${response.status}`);
    }

    return response.json();
};