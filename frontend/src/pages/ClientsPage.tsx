import {useEffect, useMemo, useState} from 'react';
import {
    Avatar,
    Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {useSearchParams} from 'react-router-dom';
import {useIntl} from 'react-intl';

import ListView, {type ListViewColumn} from '@components/Common/ListView';
import {getClients, type ClientDTO} from '@api/Clients';

export default function ClientsPage() {
    const {formatMessage} = useIntl();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const search = searchParams.get('search') ?? '';
    const sortBy = searchParams.get('sortBy') ?? 'nameAsc';

    const [clients, setClients] = useState<ClientDTO[]>([]);
    const [size] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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

    const sortedClients = useMemo(() => {
        return [...clients].sort((a, b) => {
            const fullNameA = `${a.name} ${a.surname}`;
            const fullNameB = `${b.name} ${b.surname}`;

            switch (sortBy) {
                case 'nameDesc':
                    return fullNameB.localeCompare(fullNameA);
                case 'emailAsc':
                    return a.email.localeCompare(b.email);
                case 'emailDesc':
                    return b.email.localeCompare(a.email);
                case 'nameAsc':
                default:
                    return fullNameA.localeCompare(fullNameB);
            }
        });
    }, [clients, sortBy]);

    const fetchClients = async () => {
        setIsLoading(true);

        try {
            const result = await getClients({
                page,
                size,
                search,
            });

            setClients(result.content);
            setTotalElements(result.totalElements);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchClients();
    }, [page, size, search]);

    const setPage = (nextPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(nextPage));
        setSearchParams(nextParams);
    };

    const handleVehiclesClick = (client: ClientDTO) => {
        // TODO: navigate to client vehicles page when route is ready
        // navigate(`/clients/${client.id}/vehicles`);
        console.log('Vehicles clicked:', client.id);
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
            <ListView
                items={sortedClients}
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
        </Box>
    );
}