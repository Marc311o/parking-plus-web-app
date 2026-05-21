import type {CarType} from '@api/MyCars';

export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED';

export type ReservationDetailsDTO = {
    id: string;
    created_at: string;
    start_time: string;
    end_time: string;
    price: number;
    status: ReservationStatus;
    parking_place_id: string;
    vehicle_licence_plate: string;
    vehicle_type: CarType;
};