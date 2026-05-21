import {useMemo} from 'react';
import {Box, Avatar} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import {useSearchParams} from 'react-router-dom';
import {useState} from 'react';
import ReservationDetailsDialog
    from '@components/MyReservations/ReservationDetailsDialog';

import ListView, {
    type ListViewColumn,
} from '@components/Common/ListView';

import type {CarType} from '@api/MyCars';
import type {ReservationDetailsDTO, ReservationStatus} from '@api/MyReservations';



export const mockReservations: ReservationDetailsDTO[] = [
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
        parking_place_id: 'PARK-D11',
        vehicle_licence_plate: 'EL9999X',
        vehicle_type: 'EV_HANDICAPED',
    },
    {
        id: '5',
        created_at: '2026-05-16 08:30',
        start_time: '2026-05-17 09:00',
        end_time: '2026-05-17 13:00',
        price: 22.75,
        status: 'CONFIRMED',
        parking_place_id: 'PARK-E07',
        vehicle_licence_plate: 'WY1122Z',
        vehicle_type: 'REGULAR_ABLEBODIED',
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

    const [selectedReservation, setSelectedReservation] =
        useState<ReservationDetailsDTO | null>(null);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const handleOpenDetails = (
        reservation: ReservationDetailsDTO
    ) => {
        setSelectedReservation(reservation);
        setDialogOpen(true);
    };

    const pagedReservations = useMemo(() => {
        const start = page * size;

        return mockReservations.slice(
            start,
            start + size
        );
    }, [page]);

    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case 'CONFIRMED':
                return '#2e7d32';

            case 'PENDING':
                return '#ed6c02';

            case 'CANCELLED':
                return '#d32f2f';

            case 'COMPLETED':
                return '#1565c0';

            default:
                return '#757575';
        }
    };

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
                            fontWeight: 700,
                            color: getStatusColor(item.status),
                        }}
                    >
            {item.status}
        </span>
                ),
            },

            {
                key: 'actions',
                width: '0.8fr',
                render: (item) => (
                    <button
                        onClick={() =>
                            handleOpenDetails(item)
                        }
                        style={{
                            background: '#7F0F96',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: 8,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Details
                    </button>
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


            <ReservationDetailsDialog
                open={dialogOpen}
                reservation={selectedReservation}
                onClose={() => setDialogOpen(false)}
            />

        </Box>
    );
};

export default MyReservationsPage;