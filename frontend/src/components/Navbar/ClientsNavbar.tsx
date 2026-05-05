import {Box} from '@mui/material';
import {useSearchParams} from 'react-router-dom';

import ClientsFilterCard from '../NavbarCard/ClientsFilterCard.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

const ALLOWED_SORT_BY_VALUES = ['nameAsc', 'nameDesc', 'emailAsc', 'emailDesc'] as const;

const ClientsNavbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const sortByParam = searchParams.get('sortBy');
    const sortBy = sortByParam && ALLOWED_SORT_BY_VALUES.includes(sortByParam as (typeof ALLOWED_SORT_BY_VALUES)[number])
        ? sortByParam
        : 'nameAsc';

    const updateParams = (nextValues: Record<string, string>) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(nextValues).forEach(([key, value]) => {
            if (value.trim()) {
                nextParams.set(key, value);
            } else {
                nextParams.delete(key);
            }
        });

        nextParams.set('page', '0');
        setSearchParams(nextParams);
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 2,
                px: 3,
                alignItems: 'center',
            }}
        >
            <ClientsFilterCard
                search={search}
                sortBy={sortBy}
                onSearchChange={(value) => updateParams({search: value})}
                onSortChange={(value) => updateParams({sortBy: value})}
            />

            <ClockCard/>
            <UserCard/>
        </Box>
    );
};

export default ClientsNavbar;