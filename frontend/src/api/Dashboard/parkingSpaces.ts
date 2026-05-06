import {API_URL, getHeaders} from '../core';
import type {ParkingSpaceDto, ParkingSpotDetails} from './types.ts';

export const getParkingSpacesByLevel = async (
    level: number
): Promise<ParkingSpaceDto[]> => {
    const response = await fetch(`${API_URL}/parking-spaces/level/${level}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch parking spaces for level ${level}. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};

export const getParkingSpaceById = async (
    id: string
): Promise<ParkingSpaceDto> => {
    const response = await fetch(`${API_URL}/parking-spaces/${id}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch parking space ${id}. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};

export const getParkingSpotDetails = async (
    id: string
): Promise<ParkingSpotDetails> => {
    const response = await fetch(`${API_URL}/parking-spaces/${id}/details`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Failed to fetch parking space details ${id}. Status: ${response.status}. Body: ${body}`
        );
    }

    return response.json();
};