import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import UserCard from '../NavbarCard/UserCard.tsx';
import PricingSwitcher from '../Pricing/PricingSwitcher.tsx';
import { usePricingViewStore } from '@store/usePricingViewStore.ts';

const CompactClockCard = () => {
    const intl = useIntl();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                height: 130,
                px: 3,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '2rem', lineHeight: 1.2 }}>
                {intl.formatTime(now, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '1rem', mt: 1 }}>
                {intl.formatDate(now, { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
        </Paper>
    );
};

const PricingNavbar = () => {
    const { view, setView } = usePricingViewStore();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr 1.2fr',
                gap: 2,
                px: 3,
                alignItems: 'center',
            }}
        >
            <CompactClockCard />
            <PricingSwitcher view={view} onViewChange={setView} />
            <UserCard />
        </Box>
    );
};

export default PricingNavbar;