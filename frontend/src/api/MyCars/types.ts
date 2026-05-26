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
};

export type UpdateVehicleDTO = {
    licensePlate: string;
    carType: CarType;
}