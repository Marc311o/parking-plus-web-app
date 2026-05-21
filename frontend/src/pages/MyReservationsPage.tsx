import {useMemo} from 'react';
import {Box, Avatar} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import {useSearchParams} from 'react-router-dom';

import ListView, {
    type ListViewColumn,
} from '@components/Common/ListView';

type ReservationStatus =
    | 'CONFIRMED'
    | 'PENDING'
    | 'CANCELLED';

type VehicleType =
    | 'SEDAN'
    | 'SUV'
    | 'HATCHBACK'
    | 'COUPE';

type ReservationDetailsDTO = {
    id: string;
    created_at: string;
    start_time: string;
    end_time: string;
    price: number;
    status: ReservationStatus;
    parking_place_id: string;
    vehicle_licence_plate: string;
    vehicle_type: VehicleType;
};

const mockReservations: ReservationDetailsDTO[] = [
    {
        id: '1',
        created_at: '2026-05-20 12:45',
        start_time: '2026-05-21 10:00',
        end_time: '2026-05-21 14:00',
        price: 25.99,
        status: 'CONFIRMED',
        parking_place_id: 'A12',
        vehicle_licence_plate: 'EL1234A',
        vehicle_type: 'SEDAN',
    },
    {
        id: '2',
        created_at: '2026-05-20 15:10',
        start_time: '2026-05-22 08:00',
        end_time: '2026-05-22 12:00',
        price: 18.5,
        status: 'PENDING',
        parking_place_id: 'B03',
        vehicle_licence_plate: 'EZ5678K',
        vehicle_type: 'SUV',
    },
    {
        id: '3',
        created_at: '2026-05-19 18:20',
        start_time: '2026-05-23 09:00',
        end_time: '2026-05-23 11:00',
        price: 12,
        status: 'CANCELLED',
        parking_place_id: 'C21',
        vehicle_licence_plate: 'EPA9988',
        vehicle_type: 'HATCHBACK',
    },
];

const MyReservationsPage = () => {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const page = Number(
        searchParams.get('page') ?? 0
    );

    const size = 10;

    const totalElements =
        mockReservations.length;

    const totalPages = Math.max(
        Math.ceil(totalElements / size),
        1
    );

    const pagedReservations = useMemo(() => {
        const start = page * size;

        return mockReservations.slice(
            start,
            start + size
        );
    }, [page]);

    const handlePageChange = (
        nextPage: number
    ) => {
        const nextParams =
            new URLSearchParams(
                searchParams
            );

        nextParams.set(
            'page',
            String(nextPage)
        );

        setSearchParams(nextParams);
    };

    const columns = useMemo<
        ListViewColumn<ReservationDetailsDTO>[]
    >(
        () => [
            {
                key: 'parking_place_id',
                width: '0.8fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 600,
                            color: '#7F0F96',
                        }}
                    >
                        {item.parking_place_id}
                    </span>
                ),
            },
            {
                key: 'vehicle_licence_plate',
                width: '1fr',
                render: (item) => (
                    <span>
                        {
                            item.vehicle_licence_plate
                        }
                    </span>
                ),
            },
            {
                key: 'vehicle_type',
                width: '1fr',
                render: (item) => (
                    <span>
                        {item.vehicle_type}
                    </span>
                ),
            },
            {
                key: 'start_time',
                width: '1.2fr',
                render: (item) => (
                    <span>
                        Od: {item.start_time}
                    </span>
                ),
            },
            {
                key: 'end_time',
                width: '1.2fr',
                render: (item) => (
                    <span>
                        Do: {item.end_time}
                    </span>
                ),
            },
            {
                key: 'price',
                width: '0.7fr',
                render: (item) => (
                    <span>
                        {item.price.toFixed(2)} zł
                    </span>
                ),
            },
            {
                key: 'status',
                width: '0.8fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 600,
                            color:
                                item.status ===
                                'CONFIRMED'
                                    ? '#2e7d32'
                                    : item.status ===
                                    'PENDING'
                                        ? '#ed6c02'
                                        : '#d32f2f',
                        }}
                    >
                        {item.status}
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            <h1>My reservations</h1>

            <ListView
                items={pagedReservations}
                isLoading={false}
                emptyMessage="No reservations found"
                columns={columns}
                pagination={{
                    page,
                    totalPages,
                    onPageChange:
                    handlePageChange,
                }}
                getIcon={() => (
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor:
                                'transparent',
                            color: '#7F0F96',
                        }}
                    >
                        <EventSeatIcon />
                    </Avatar>
                )}
            />
        </Box>
    );
};

export default MyReservationsPage;