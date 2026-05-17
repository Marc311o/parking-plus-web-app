import type {VehicleDTO} from './types';
import {API_URL, getHeaders} from '../core';

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

export const addVehicle = async (
    dto: Omit<VehicleDTO, 'id'>
): Promise<VehicleDTO> => {

    const response = await fetch(
        `${API_URL}/vehicles`,
        {
            method: 'POST',
            headers: {
                ...getHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to add vehicle: ${response.status}`);
    }

    return response.json();
};

export const deleteVehicle = async (id: string): Promise<void> => {
    const response = await fetch(
        `${API_URL}/vehicles/${id}`,
        {
            method: 'DELETE',
            headers: getHeaders(),
        }
    );

    if (!response.ok) {
        const text = await response.text();

        if (response.status === 403) {
            throw new Error('You are not allowed to delete this vehicle');
        }

        if (response.status === 404) {
            throw new Error('Vehicle not found');
        }

        throw new Error(text || `Failed to delete vehicle: ${response.status}`);
    }
};