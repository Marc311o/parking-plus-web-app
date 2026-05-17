export type CarType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED';

export type VehicleDTO = {
    id: string;
    licensePlate: string;
    ownerId: string;
    carType: CarType;
};