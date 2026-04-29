import type {ParkingSpaceDto} from './types.ts';

//TODO: TAKE BACK FROM ENV

const API_BASE_URL = 'http://localhost:8080/api';

export const parkingSpacesApi = {
    async getByLevel(level: number): Promise<ParkingSpaceDto[]> {
        const response = await fetch(`${API_BASE_URL}/parking-spaces/level/${level}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch parking spaces for level ${level}`);
        }

        return response.json();
    },

    async getById(id: string): Promise<ParkingSpaceDto> {
        const response = await fetch(`${API_BASE_URL}/parking-spaces/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch parking space ${id}`);
        }

        return response.json();
    },
};