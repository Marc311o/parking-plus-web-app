import {API_URL, getHeaders} from '../core';
import type {ClientDTO, VehicleDTO, GetClientsParams, PageResponse} from './types';

const USERS_URL = `${API_URL}/users`;
const VEHICLES_URL = `${API_URL}/vehicles`;

//TODO: BACKEND WILL AD SORTING
export const getClients = async ({
                                     page,
                                     size,
                                     search,
                                 }: GetClientsParams): Promise<PageResponse<ClientDTO>> => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (search?.trim()) {
        params.append('search', search.trim());
    }

    const response = await fetch(`${USERS_URL}?${params.toString()}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch clients');
    }

    return response.json();
};

export const getClientVehicles = async (ownerId: number): Promise<VehicleDTO[]> => {
    const response = await fetch(`${VEHICLES_URL}/owner/${ownerId}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch client vehicles');
    }

    return response.json();
};