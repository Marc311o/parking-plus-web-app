export type CarType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED';

export type VehicleDTO = {
    id: number;
    licensePlate: string;
    ownerId: number;
    carType: CarType;
    isActive: boolean;
};

export type UpdateVehicleDTO = {
    licensePlate: string;
    carType: CarType;
}
