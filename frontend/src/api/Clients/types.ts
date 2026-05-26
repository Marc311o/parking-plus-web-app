export type CarType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED';


export interface ClientDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export interface VehicleDTO {
    id: number;
    licensePlate: string;
    carType: CarType;
    ownerId: number;
    isActive: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface GetClientsParams {
    page: number;
    size: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}
