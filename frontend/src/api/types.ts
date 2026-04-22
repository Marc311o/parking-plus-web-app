export type ParkingLevel = 'A' | 'B';

export type ParkingSpotStatus = 'available' | 'occupied' | 'reserved';

export type SpaceType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED'
    | 'REGULAR_BOTH'
    | 'EV_BOTH';

export interface ParkingSpot {
    id: string;
    label: string;
    status?: ParkingSpotStatus;
    spaceType?: SpaceType;
}