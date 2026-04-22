import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {ParkingSpotDetails} from '@api/types';

interface ParkingSpotDetailsPanelProps {
    details: ParkingSpotDetails | null;
}

const labelCellSx = {
    fontSize: 16,
    fontWeight: 400,
    color: '#7D7D7D',
    lineHeight: 1.2,
};

const valueCellSx = {
    fontSize: 16,
    fontWeight: 400,
    color: '#7D7D7D',
    textAlign: 'right',
    lineHeight: 1.2,
};

const rowSx = {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    px: 2,
    py: 1.8,
    backgroundColor: '#E9DCEA',
};

const bigCardSx = {
    minHeight: 360,
    borderRadius: '16px',
    border: '1px solid #CFCFCF',
    boxShadow: '0 3px 8px rgba(0,0,0,0.16)',
    p: 2,
    bgcolor: '#F5F5F5',
};

const smallCardSx = {
    minHeight: 165,
    borderRadius: '16px',
    border: '1px solid #CFCFCF',
    boxShadow: '0 3px 8px rgba(0,0,0,0.16)',
    p: 1.5,
    bgcolor: '#F5F5F5',
};

const cardTitleSx = {
    fontSize: 22,
    fontWeight: 400,
    textAlign: 'center',
    color: '#111111',
    mb: 2.5,
};

const ParkingSpotDetailsPanel = ({details}: ParkingSpotDetailsPanelProps) => {
    const intl = useIntl();

    if (!details) return null;

    const isOccupied = details.status === 'OCCUPIED' && details.occupant;

    return (
        <Box
            sx={{
                mt: 2,
                borderRadius: '18px',
                backgroundColor: '#F5F5F5',
                p: 2.5,
            }}
        >
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: 34,
                    fontWeight: 400,
                    color: '#111111',
                    lineHeight: 1,
                    mb: 2.5,
                }}
            >
                {details.id}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: isOccupied ? '1fr 1fr 0.72fr' : '1fr',
                    gap: 2,
                    alignItems: 'stretch',
                }}
            >
                <Paper elevation={0} sx={bigCardSx}>
                    <Typography sx={cardTitleSx}>
                        {intl.formatMessage(
                            {id: 'parking.details.spotCardTitle'},
                            {id: details.id}
                        )}
                    </Typography>

                    <Box sx={rowSx}>
                        <Typography sx={labelCellSx}>
                            {intl.formatMessage({id: 'parking.details.labels.type'})}
                        </Typography>
                        <Typography sx={valueCellSx}>
                            {intl.formatMessage(
                                {id: `parking.details.spaceTypes.${details.type}`},
                                {defaultMessage: details.type}
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{height: 14}}/>

                    <Box sx={rowSx}>
                        <Typography sx={labelCellSx}>
                            {intl.formatMessage({id: 'parking.details.labels.status'})}
                        </Typography>
                        <Typography sx={valueCellSx}>
                            {intl.formatMessage(
                                {id: `parking.details.statuses.${details.status}`},
                                {defaultMessage: details.status}
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{height: 14}}/>

                    <Box sx={rowSx}>
                        <Typography sx={labelCellSx}>
                            {intl.formatMessage({id: 'parking.details.labels.level'})}
                        </Typography>
                        <Typography sx={valueCellSx}>
                            {details.level}
                        </Typography>
                    </Box>
                </Paper>

                {isOccupied && (
                    <>
                        <Paper elevation={0} sx={bigCardSx}>
                            <Typography sx={cardTitleSx}>
                                {intl.formatMessage(
                                    {id: 'parking.details.ownerCardTitle'},
                                    {id: details.occupant.ownerId}
                                )}
                            </Typography>

                            <Box sx={rowSx}>
                                <Typography sx={labelCellSx}>
                                    {intl.formatMessage({id: 'parking.details.labels.ownerData'})}
                                </Typography>
                                <Typography sx={valueCellSx}>
                                    {details.occupant.ownerName}
                                </Typography>
                            </Box>

                            <Box sx={{height: 14}}/>

                            <Box sx={rowSx}>
                                <Typography sx={labelCellSx}>
                                    {intl.formatMessage({id: 'parking.details.labels.email'})}
                                </Typography>
                                <Typography sx={valueCellSx}>
                                    {details.occupant.ownerEmail}
                                </Typography>
                            </Box>

                            <Box sx={{height: 14}}/>

                            <Box sx={rowSx}>
                                <Typography sx={labelCellSx}>
                                    {intl.formatMessage({id: 'parking.details.labels.phone'})}
                                </Typography>
                                <Typography sx={valueCellSx}>
                                    {details.occupant.ownerPhone}
                                </Typography>
                            </Box>
                        </Paper>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <Paper elevation={0} sx={smallCardSx}>
                                <Box
                                    sx={{
                                        width: 92,
                                        height: 76,
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#DDD',
                                        mb: 1.5,
                                    }}
                                >
                                    {details.occupant.imageUrl && (
                                        <Box
                                            component="img"
                                            src={details.occupant.imageUrl}
                                            alt={details.occupant.vehiclePlate}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto',
                                        rowGap: 1,
                                        columnGap: 1.5,
                                    }}
                                >
                                    <Typography sx={labelCellSx}>
                                        {intl.formatMessage({id: 'parking.details.labels.entry'})}
                                    </Typography>
                                    <Typography sx={valueCellSx}>
                                        {details.occupant.entryTime}
                                    </Typography>

                                    <Typography sx={labelCellSx}>
                                        {intl.formatMessage({id: 'parking.details.labels.plate'})}
                                    </Typography>
                                    <Typography sx={valueCellSx}>
                                        {details.occupant.vehiclePlate}
                                    </Typography>
                                </Box>
                            </Paper>

                            <Paper elevation={0} sx={smallCardSx}>
                                <Box
                                    sx={{
                                        width: 92,
                                        height: 76,
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        backgroundColor: '#DDD',
                                        mb: 1.5,
                                    }}
                                >
                                    {details.occupant.imageUrl && (
                                        <Box
                                            component="img"
                                            src={details.occupant.imageUrl}
                                            alt={details.occupant.vehiclePlate}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto',
                                        rowGap: 1,
                                        columnGap: 1.5,
                                    }}
                                >
                                    <Typography sx={labelCellSx}>
                                        {intl.formatMessage({id: 'parking.details.labels.parkingTime'})}
                                    </Typography>
                                    <Typography sx={valueCellSx}>
                                        {details.occupant.parkingDuration}
                                    </Typography>

                                    <Typography sx={labelCellSx}>
                                        {intl.formatMessage({id: 'parking.details.labels.amountDue'})}
                                    </Typography>
                                    <Typography sx={valueCellSx}>
                                        {details.occupant.amountDue}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ParkingSpotDetailsPanel;