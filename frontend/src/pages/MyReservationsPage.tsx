import {useEffect, useMemo} from 'react';
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
import {useAuthStore} from '@store/useAuthStore';
import {getReservationsByUser} from "../api/MyReservations/myreservations.ts";
import { Alert } from '@mui/material';

const MyReservationsPage = () => {
    const token = useAuthStore((state) => state.token);


    const [reservations, setReservations] = useState<ReservationDetailsDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchParams, setSearchParams] =
        useSearchParams();

    const page = Number(
        searchParams.get('page') ?? 0
    );

    const size = 10;


    const totalPages = Math.max(
        Math.ceil(reservations.length / size),
        1
    );

    const [selectedReservation, setSelectedReservation] =
        useState<ReservationDetailsDTO | null>(null);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        const fetchReservations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result =
                    await getReservationsByUser(
                        token
                    );

                if (!isMounted) return;

                setReservations(result);
            } catch (error) {
                if (!isMounted) return;

                setReservations([]);

                const message =
                    error instanceof Error
                        ? error.message
                        : null;

                if (message) {
                    setError(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchReservations();

        return () => {
            isMounted = false;
        };
    }, [token]);

    const handleOpenDetails = (
        reservation: ReservationDetailsDTO
    ) => {
        setSelectedReservation(reservation);
        setDialogOpen(true);
    };

    const pagedReservations = useMemo(() => {
        const start = page * size;
        return reservations.slice(start, start + size);
    }, [reservations, page]);

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
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

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
                        <EventSeatIcon/>
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