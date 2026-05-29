import type { CarType } from '@api/Clients';

export type ParkingPurchaseMode = 'PURCHASE' | 'RESERVATION' | 'INDEFINITE';

export type VehicleDTO = {
    id?: number;
    licensePlate: string;
    ownerId?: number;
    carType: CarType;
};

export type ParkingSpaceDTO = {
    id: string;
    status: string;
    spaceType: string;
    level: number;
};

export type ParkingQuoteRequestDTO = {
    mode: ParkingPurchaseMode;
    startTime: string;
    endTime: string | null;
};

export type ParkingPurchaseRequestDTO = {
    vehicleId: number;
    mode: ParkingPurchaseMode;
    startTime: string;
    endTime: string | null;
};

export type ParkingQuoteDTO = {
    price: number;
    balanceAfter: number;
    currency?: string;
};

export type ParkingPurchaseDTO = {
    id: number;
    vehicleId: number;
    licensePlate: string;
    mode: ParkingPurchaseMode;
    parkingSpace: ParkingSpaceDTO;
    startTime: string;
    endTime: string | null;
    price: number;
    balanceAfter: number;
    currency?: string;
};