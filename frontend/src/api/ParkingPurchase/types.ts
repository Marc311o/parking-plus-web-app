export type ParkingPurchaseMode = 'PURCHASE' | 'RESERVATION';

export type VehicleDTO = {
    id?: number;
    licensePlate: string;
    ownerId?: number;
    carType: string;
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
    endTime: string;
};

export type ParkingPurchaseRequestDTO = {
    vehicleId: number;
    mode: ParkingPurchaseMode;
    startTime: string;
    endTime: string;
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
    endTime: string;
    price: number;
    balanceAfter: number;
    currency?: string;
};