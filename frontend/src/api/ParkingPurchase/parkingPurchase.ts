import {API_URL, getHeaders} from '../core';
import type {
    ParkingPurchaseDTO,
    ParkingPurchaseRequestDTO,
    ParkingQuoteDTO,
    ParkingQuoteRequestDTO,
    VehicleDTO,
} from './types';

const readErrorBody = async (response: Response) => {
    const body = await response.text();

    return `Status: ${response.status}. Body: ${body}`;
};

const getJsonHeaders = () => ({
    ...getHeaders(),
    'Content-Type': 'application/json',
});

export const getParkingQuote = async (
    payload: ParkingQuoteRequestDTO,
): Promise<ParkingQuoteDTO> => {
    const response = await fetch(`${API_URL}/reservations/quote`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch parking quote. ${await readErrorBody(response)}`);
    }

    return response.json();
};

export const purchaseParking = async (
    payload: ParkingPurchaseRequestDTO,
): Promise<ParkingPurchaseDTO> => {
    const response = await fetch(`${API_URL}/reservations/purchase`, {
        method: 'POST',
        headers: getJsonHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to purchase parking. ${await readErrorBody(response)}`);
    }

    return response.json();
};