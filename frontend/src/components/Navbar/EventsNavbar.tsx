import {Box} from '@mui/material';
import {useSearchParams} from 'react-router-dom';

import EventsFilterCard from '../NavbarCard/EventsFilterCard.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

const EventsNavbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') ?? '';

    const entryChecked =
        searchParams.get('entry') !== 'false';

    const exitChecked =
        searchParams.get('exit') !== 'false';

    const updateParams = (nextValues: Record<string, string>) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(nextValues).forEach(([key, value]) => {
            nextParams.set(key, value);
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
            <EventsFilterCard
                search={search}
                entryChecked={entryChecked}
                exitChecked={exitChecked}
                onSearchChange={(value) =>
                    updateParams({search: value})
                }
                onEntryChange={(value) =>
                    updateParams({entry: String(value)})
                }
                onExitChange={(value) =>
                    updateParams({exit: String(value)})
                }
            />

            <ClockCard/>
            <UserCard/>
        </Box>
    );
};

export default EventsNavbar;