export type ParkingPurchaseMode = 'PURCHASE' | 'RESERVATION';

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