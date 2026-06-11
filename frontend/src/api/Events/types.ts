export type ParkingEventType = 'ENTRY' | 'EXIT';

export type ParkingEventDTO = {
    id: number;
    plateNumber: string;
    eventType: ParkingEventType;
    eventDate: string;

    ownerName: string;
    ownerSurname: string;
    ownerEmail: string;

    barrierPhotoPath?: string;
    spotPhotoPath?: string;
};

export type GetEventsParams = {
    page: number;
    size: number;
    search?: string;
    entry?: boolean;
    exit?: boolean;
};