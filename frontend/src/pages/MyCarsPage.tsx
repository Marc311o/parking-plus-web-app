import {useEffect, useMemo, useState} from 'react';
import {Box, Avatar, Alert} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {useSearchParams} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


import ListView, {type ListViewColumn} from '@components/Common/ListView';
import type {CarType} from "@api/MyCars";
import type {VehicleDTO} from "@api/MyCars";
import {getVehiclesByOwner} from "@api/MyCars";
import {useAuthStore} from '@store/useAuthStore';


const MyCarsPage = () => {
    const {formatMessage} = useIntl();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const size = 10;

    const user = useAuthStore((state) => state.user);

    const ownerId = user?.id;

    const [cars, setCars] = useState<VehicleDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                <span style={{fontWeight: 600}}>
                    {item.licensePlate}
                </span>
            ),
        },
        {
            key: 'type',
            width: '1fr',
            render: (item) => (
                <span style={{fontWeight: 600}}>
                    {formatCarType(item.carType)}
                </span>
            ),
        },
    ], []);

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
                    onClick={() => console.log('Open add car modal')}
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
                            color: '#1976d2',
                        }}
                    >
                        <DirectionsCarIcon/>
                    </Avatar>
                )}
            />
        </Box>
    );
};

export default MyCarsPage;