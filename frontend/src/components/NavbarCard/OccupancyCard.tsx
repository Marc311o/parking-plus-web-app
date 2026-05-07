import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {getParkingSpaceOccupancy} from '@api/ParkingSpaces';

const OccupancyCard = () => {
    const {formatMessage} = useIntl();

    const [occupied, setOccupied] = useState(0);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOccupancy = async () => {
            try {
                setIsLoading(true);

                const stats = await getParkingSpaceOccupancy();

                setOccupied(stats.occupied);
                setTotal(stats.total);
            } catch (error) {
                console.error('Failed to fetch parking occupancy:', error);
                setOccupied(0);
                setTotal(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOccupancy();
    }, []);

    const progress = total > 0 ? occupied / total : 0;
    const progressPercent = Math.max(0, Math.min(progress * 100, 100));

    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: 130,
                px: 2.5,
                py: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: 200,
                    height: 95,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg
                    width="300"
                    height="120"
                    viewBox="0 0 210 140"
                    style={{
                        position: 'absolute',
                        top: -2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <path
                        d="M 24 94 A 81 81 0 0 1 186 94"
                        fill="none"
                        stroke="#D6D6DA"
                        strokeWidth="9"
                        strokeLinecap="round"
                        pathLength={100}
                    />
                    <path
                        d="M 24 94 A 81 81 0 0 1 186 94"
                        fill="none"
                        stroke="#9325B2"
                        strokeWidth="9"
                        strokeLinecap="round"
                        pathLength={100}
                        strokeDasharray={`${progressPercent} 100`}
                    />
                </svg>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 42,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '22px',
                            fontWeight: 500,
                            color: '#111111',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            mb: 0.4,
                        }}
                    >
                        {isLoading ? '...' : `${occupied}/${total}`}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: '13px',
                            fontWeight: 400,
                            color: '#111111',
                            lineHeight: 1.1,
                        }}
                    >
                        {formatMessage({id: 'navbar.occupancy.label'})}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default OccupancyCard;