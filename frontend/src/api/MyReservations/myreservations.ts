import type {ReservationDetailsDTO} from '@api/MyReservations';
import {API_URL, getHeaders} from '../core';

export const getReservationsByUser = async (
    token: string
): Promise<ReservationDetailsDTO[]> => {

    if (!token) {
        throw new Error('Unauthorized');
    }

    const response = await fetch(
        `${API_URL}/reservations/my`,
        {
            method: 'GET',
            headers: {
                ...getHeaders(),
                Authorization: `Bearer ${token}`,
            },

        }
    );

    if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Failed to fetch reservations: ${response.status} ${responseBody}`);
    }

    return response.json();
};