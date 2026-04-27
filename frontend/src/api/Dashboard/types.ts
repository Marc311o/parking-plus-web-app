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
    ownerPhone: string;
    vehiclePlate: string;
    entryTime: string;
    parkingDuration: string;
    amountDue: string;
    imageUrl?: string;
}

export interface ParkingSpotDetails {
    id: string;
    type: SpaceType;
    status: ParkingSpaceStatus;
    level: number;
    occupant?: ParkingSpotOccupantDetails;
}