import {API_URL, getHeaders} from '../core';
import type {TariffDTO} from './types';

export const getTariffs = async (): Promise<TariffDTO[]> => {
    const response = await fetch(`${API_URL}/tariffs`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to fetch tariffs. Status: ${response.status}. Body: ${body}`);
    }

    return response.json();
};

export const createTariff = async (payload: TariffDTO): Promise<TariffDTO> => {
    const response = await fetch(`${API_URL}/tariffs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to create tariff. Status: ${response.status}. Body: ${body}`);
    }

    return response.json();
};

export const updateTariff = async (
    id: number,
    payload: TariffDTO
): Promise<TariffDTO> => {
    const response = await fetch(`${API_URL}/tariffs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to update tariff. Status: ${response.status}. Body: ${body}`);
    }

    return response.json();
};

export const deleteTariff = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/tariffs/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to delete tariff. Status: ${response.status}. Body: ${body}`);
    }
};