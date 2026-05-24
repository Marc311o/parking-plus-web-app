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
        throw new Error(`Failed to fetch vehicles: ${response.status}`);
    }

    return response.json();
};