import {API_URL, getHeaders} from '../core';
import type {ClientDTO, VehicleDTO, GetClientsParams, PageResponse} from './types';

export const getClients = async ({
                                     page,
                                     size,
                                     search,
                                     sortBy = 'name',
                                     sortDir = 'asc',
                                 }: GetClientsParams): Promise<PageResponse<ClientDTO>> => {
    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('size', String(size));
    params.set('clientsOnly', 'true');
    params.set('sortBy', sortBy);
    params.set('sortDir', sortDir);

    if (search != undefined && search.trim()) {
        params.set('search', search.trim());
    }

    const response = await fetch(`${API_URL}/users?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to fetch clients. Status: ${response.status}. Body: ${body}`);
    }

    return response.json();
};

export const getClientVehicles = async (clientId: number): Promise<VehicleDTO[]> => {
    const response = await fetch(`${API_URL}/vehicles/user/${clientId}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to fetch client vehicles. Status: ${response.status}. Body: ${body}`);
    }

    return response.json();
};