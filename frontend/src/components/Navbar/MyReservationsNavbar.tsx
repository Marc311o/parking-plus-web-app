import {Box} from '@mui/material';
import {useSearchParams} from 'react-router-dom';

import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';
import DateFilterCard from '../NavbarCard/DateFilterCard.tsx';

const MyReservationsNavbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const startDate =
        searchParams.get('startDate') ?? '';

    const endDate =
        searchParams.get('endDate') ?? '';

    const showAll =
        searchParams.get('showAll') === 'true';

    const updateParams = (nextValues: Record<string, string | null>) => {
        const nextParams = new URLSearchParams(searchParams);

        Object.entries(nextValues).forEach(([key, value]) => {
            if (value === null || value === '') {
                nextParams.delete(key);
            } else {
                nextParams.set(key, value);
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
            <DateFilterCard
                startDate={startDate}
                endDate={endDate}
                showAll={showAll}
                onStartDateChange={(value) =>
                    updateParams({startDate: value})
                }
                onEndDateChange={(value) =>
                    updateParams({endDate: value})
                }
                onShowAllChange={(value) => {
                    updateParams({
                        showAll: String(value),
                        startDate: value ? null : startDate,
                        endDate: value ? null : endDate,
                    });
                }
                }
            />

            <ClockCard/>

            <UserCard/>
        </Box>
    );
};

export default MyReservationsNavbar;