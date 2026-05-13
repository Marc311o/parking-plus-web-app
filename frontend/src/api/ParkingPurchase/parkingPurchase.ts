import {API_URL, getHeaders} from '../core';
import type {
    ParkingPurchaseDTO,
    ParkingPurchaseRequestDTO,
    ParkingQuoteDTO,
    ParkingQuoteRequestDTO,
    VehicleDTO,
    WalletBalanceDTO,
} from './types';

const readErrorBody = async (response: Response) => {
    const body = await response.text();

    return `Status: ${response.status}. Body: ${body}`;
};

export const getMyVehicles = async (): Promise<VehicleDTO[]> => {
    const response = await fetch(`${API_URL}/vehicles/me`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user vehicles. ${await readErrorBody(response)}`);
    }

    return response.json();
};

export const getWalletBalance = async (): Promise<WalletBalanceDTO> => {
    const response = await fetch(`${API_URL}/wallet/balance`, {
        method: 'GET',
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch wallet balance. ${await readErrorBody(response)}`);
    }

    return response.json();
};

export const getParkingQuote = async (
    payload: ParkingQuoteRequestDTO,
): Promise<ParkingQuoteDTO> => {
    const response = await fetch(`${API_URL}/parking-purchase/quote`, {
        method: 'POST',
        headers: getHeaders(),
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
    const response = await fetch(`${API_URL}/parking-purchase`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to purchase parking. ${await readErrorBody(response)}`);
    }

    return response.json();
};