export type ParkingLevel = 'A' | 'B';

export type ParkingSpaceStatus = 'FREE' | 'OCCUPIED' | 'RESERVED';

export type SpaceType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED'
    | 'REGULAR_BOTH'
    | 'EV_BOTH';

export interface ParkingSpaceDto {
    id: string;
    status: ParkingSpaceStatus;
    spaceType: SpaceType;
    level: number;
}

export interface ParkingSpotOccupantDetails {
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    vehiclePlate: string;
    entryTime: string;
    parkingDurationSec: number;
    amountDue: number;
    barrierPhotoPath: string | null;
    spotPhotoPath: string | null;
}

export interface ParkingSpotDetails {
    id: string;
    type: SpaceType;
    status: ParkingSpaceStatus;
    level: number;
    occupant: ParkingSpotOccupantDetails | null;
}