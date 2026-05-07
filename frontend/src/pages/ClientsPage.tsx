import {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Avatar,
    Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {useSearchParams} from 'react-router-dom';
import {useIntl} from 'react-intl';

import ListView, {type ListViewColumn} from '@components/Common/ListView';
import ClientVehiclesDialog from '@components/Clients/ClientVehiclesDialog';
import {getClientVehicles, getClients, type ClientDTO, type VehicleDTO} from '@api/Clients';

const mapSortOption = (sortBy: string): {sortBy: string; sortDir: 'asc' | 'desc'} => {
    switch (sortBy) {
        case 'nameDesc':
            return {sortBy: 'name', sortDir: 'desc'};
        case 'emailAsc':
            return {sortBy: 'email', sortDir: 'asc'};
        case 'emailDesc':
            return {sortBy: 'email', sortDir: 'desc'};
        case 'nameAsc':
        default:
            return {sortBy: 'name', sortDir: 'asc'};
    }
};

export default function ClientsPage() {
    const {formatMessage} = useIntl();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const search = searchParams.get('search') ?? '';
    const sortOption = searchParams.get('sortBy') ?? 'nameAsc';

    const [clients, setClients] = useState<ClientDTO[]>([]);
    const [size] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [clientsError, setClientsError] = useState<string | null>(null);

    const [selectedClient, setSelectedClient] = useState<ClientDTO | null>(null);
    const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
    const [isVehiclesLoading, setIsVehiclesLoading] = useState(false);
    const [vehiclesError, setVehiclesError] = useState<string | null>(null);

    const totalPages = Math.max(Math.ceil(totalElements / size), 1);

    const columns = useMemo<ListViewColumn<ClientDTO>[]>(() => [
        {
            key: 'fullName',
            width: '1fr',
            render: (client) => `${client.name} ${client.surname}`,
        },
        {
            key: 'email',
            width: '1.4fr',
            render: (client) => client.email,
        },
    ], []);

    useEffect(() => {
        let isMounted = true;

        const fetchClients = async () => {
            setIsLoading(true);
            setClientsError(null);

            const mappedSort = mapSortOption(sortOption);

            try {
                const result = await getClients({
                    page,
                    size,
                    search,
                    sortBy: mappedSort.sortBy,
                    sortDir: mappedSort.sortDir,
                });

                if (!isMounted) {
                    return;
                }

                setClients(result.content);
                setTotalElements(result.totalElements);
            } catch {
                if (!isMounted) {
                    return;
                }

                setClients([]);
                setTotalElements(0);
                setClientsError(formatMessage({id: 'clients.list.error'}));
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchClients();

        return () => {
            isMounted = false;
        };
    }, [page, size, search, sortOption, formatMessage]);

    const setPage = (nextPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(nextPage));
        setSearchParams(nextParams);
    };

    const handleVehiclesClick = async (client: ClientDTO) => {
        setSelectedClient(client);
        setVehicles([]);
        setVehiclesError(null);
        setIsVehiclesLoading(true);

        try {
            const result = await getClientVehicles(client.id);
            setVehicles(result);
        } catch {
            setVehiclesError(formatMessage({id: 'clients.vehiclesDialog.error'}));
        } finally {
            setIsVehiclesLoading(false);
        }
    };

    const handleCloseVehiclesDialog = () => {
        setSelectedClient(null);
        setVehicles([]);
        setVehiclesError(null);
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            {clientsError && (
                <Alert
                    severity="error"
                    sx={{
                        borderRadius: '14px',
                    }}
                >
                    {clientsError}
                </Alert>
            )}

            <ListView
                items={clients}
                isLoading={isLoading}
                emptyMessage={formatMessage({id: 'clients.list.empty'})}
                getIcon={() => (
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor: '#FFFFFF',
                            color: '#000000',
                        }}
                    >
                        <PersonIcon/>
                    </Avatar>
                )}
                columns={columns}
                action={{
                    label: formatMessage({id: 'clients.list.vehiclesButton'}),
                    onClick: handleVehiclesClick,
                }}
                pagination={{
                    page,
                    totalPages,
                    onPageChange: setPage,
                }}
            />

            <ClientVehiclesDialog
                open={Boolean(selectedClient)}
                client={selectedClient}
                vehicles={vehicles}
                isLoading={isVehiclesLoading}
                error={vehiclesError}
                onClose={handleCloseVehiclesDialog}
            />
        </Box>
    );
}