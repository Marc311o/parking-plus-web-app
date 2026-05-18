import {useEffect, useMemo, useState} from 'react';
import {Box, Avatar, Alert} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {useSearchParams} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';


import ListView, {type ListViewColumn} from '@components/Common/ListView';
import type {CarType} from "@api/MyCars";
import type {VehicleDTO} from "@api/MyCars";
import {getVehiclesByOwner, addVehicle, deleteVehicle} from "@api/MyCars";
import {useAuthStore} from '@store/useAuthStore';

import AddCarDialog from '@components/MyCars/AddCarDialog';


const MyCarsPage = () => {
    const {formatMessage} = useIntl();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const size = 3;

    const user = useAuthStore((state) => state.user);

    const ownerId = user?.id;

    const [cars, setCars] = useState<VehicleDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const totalElements = cars.length;
    const totalPages = Math.max(Math.ceil(totalElements / size), 1);

    const pagedCars = useMemo(() => {
        const start = page * size;
        return cars.slice(start, start + size);
    }, [cars, page]);

    const formatCarType = (type: CarType) => {
        return formatMessage({
            id: `myCars.carTypes.${type}`,
        });
    };

    const getErrorMessage = (e: unknown): string => {
        if (e instanceof Error) return e.message;
        return 'Unexpected error occurred';
    };

    useEffect(() => {
        const newTotalPages = Math.max(
            Math.ceil(cars.length / size),
            1
        );

        if (page >= newTotalPages) {
            handlePageChange(newTotalPages - 1);
        }
    }, [cars, page]);

    useEffect(() => {
        if (!ownerId) return;

        let isMounted = true;

        const fetchCars = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getVehiclesByOwner(ownerId);

                if (!isMounted) return;

                setCars(result);
            } catch (error) {
                if (!isMounted) return;

                setCars([]);

                const message =
                    error instanceof Error
                        ? error.message
                        : null;

                if (message) {
                    setError(message);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void fetchCars();

        return () => {
            isMounted = false;
        };
    }, [ownerId]);

    const handleDeleteVehicle = async (id: string) => {
        try {
            await deleteVehicle(id);

            setCars((prev) => {
                const updatedCars = prev.filter((v) => v.id !== id);

                const newTotalPages = Math.max(
                    Math.ceil(updatedCars.length / size),
                    1
                );

                if (page >= newTotalPages) {
                    handlePageChange(newTotalPages - 1);
                }

                return updatedCars;
            });
        } catch (e) {
            setError(getErrorMessage(e));
        }
    };

    const handlePageChange = (nextPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(nextPage));
        setSearchParams(nextParams);
    };

    const columns = useMemo<ListViewColumn<VehicleDTO>[]>(() => [
        {
            key: 'plate',
            width: '1fr',
            render: (item) => (
                <span style={{fontWeight: 600, color: '#7F0F96'}}>
                    {item.licensePlate}
                </span>
            ),
        },
        {
            key: 'type',
            width: '1fr',
            render: (item) => (
                <span style={{fontWeight: 600, color: '#7F0F96'}}>
                    {formatCarType(item.carType)}
                </span>
            ),
        },
        {
            key: 'actions',
            width: '0.5fr',
            render: (item) => (
                <IconButton
                    onClick={() => handleDeleteVehicle(item.id)}
                    size="small"
                    sx={{ color: '#d32f2f' }}
                >
                    <CloseIcon />
                </IconButton>
            ),
        }
    ], []);


    const handleAddVehicle = async (
        vehicle: Omit<VehicleDTO, 'id'>
    ) => {
        try {
            const created = await addVehicle(vehicle);

            setCars((prev) => [...prev, created]);

        } catch (e) {
            setError(getErrorMessage(e));
        }
    };

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5}}>

            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setAddDialogOpen(true)}
                >
                    {formatMessage({id: 'myCars.addCar'})}
                </Button>
            </Box>

            <ListView
                items={pagedCars}
                isLoading={isLoading}
                emptyMessage={formatMessage({id: 'myCars.list.empty'})}
                columns={columns}
                pagination={{
                    page,
                    totalPages,
                    onPageChange: handlePageChange,
                }}
                getIcon={() => (
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor: 'transparent',
                            color: '#7F0F96',
                        }}
                    >
                        <DirectionsCarIcon/>
                    </Avatar>
                )}
            />

            <AddCarDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                ownerId={ownerId}
                onSubmit={handleAddVehicle}
            />

        </Box>
    );
};

export default MyCarsPage;