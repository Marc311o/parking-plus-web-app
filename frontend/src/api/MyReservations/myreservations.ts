import type {ReservationDetailsDTO} from '@api/MyReservations';

export const getReservationsByUser = async (
    token: string
): Promise<ReservationDetailsDTO[]> => {

    if (!token) {
        throw new Error('Unauthorized');
    }

    return [
        {
            id: '1',
            created_at: '2026-05-20 12:45',
            start_time: '2026-05-21 10:00',
            end_time: '2026-05-21 14:00',
            price: 25.99,
            status: 'CONFIRMED',
            parking_place_id: 'PARK-A12',
            vehicle_licence_plate: 'EL1234A',
            vehicle_type: 'REGULAR_ABLEBODIED',
        },
        {
            id: '2',
            created_at: '2026-05-19 10:10',
            start_time: '2026-05-20 08:00',
            end_time: '2026-05-20 12:00',
            price: 18.5,
            status: 'PENDING',
            parking_place_id: 'PARK-B03',
            vehicle_licence_plate: 'EZ5678K',
            vehicle_type: 'EV_ABLEBODIED',
        },
        {
            id: '3',
            created_at: '2026-05-18 15:00',
            start_time: '2026-05-19 09:00',
            end_time: '2026-05-19 11:00',
            price: 12,
            status: 'CANCELLED',
            parking_place_id: 'PARK-C21',
            vehicle_licence_plate: 'EPA9988',
            vehicle_type: 'REGULAR_HANDICAPED',
        },
        {
            id: '4',
            created_at: '2026-05-17 09:00',
            start_time: '2026-05-18 10:00',
            end_time: '2026-05-18 12:00',
            price: 30,
            status: 'COMPLETED',
            parking_place_id: 'PARK-D112',
            vehicle_licence_plate: 'EL9999X',
            vehicle_type: 'EV_HANDICAPED',
        },
    ];
};