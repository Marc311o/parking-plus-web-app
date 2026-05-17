import {Box, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {ParkingPurchaseMode} from '@api/ParkingPurchase';

type ParkingPurchaseModeCardProps = {
    mode: ParkingPurchaseMode;
    isDisabled: boolean;
    onModeChange: (mode: ParkingPurchaseMode) => void;
};

const ParkingPurchaseModeCard = ({
                                     mode,
                                     isDisabled,
                                     onModeChange,
                                 }: ParkingPurchaseModeCardProps) => {
    const {formatMessage} = useIntl();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(139, 31, 158, 0.09)',
            }}
        >
            <Stack spacing={2}>
                <Box>
                    <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                        {formatMessage({id: 'parkingPurchase.formModeTitle'})}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                        {formatMessage({id: 'parkingPurchase.formModeDescription'})}
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    exclusive
                    value={mode}
                    disabled={isDisabled}
                    onChange={(_event, nextMode: ParkingPurchaseMode | null) => {
                        if (nextMode) {
                            onModeChange(nextMode);
                        }
                    }}
                    sx={{
                        alignSelf: 'flex-start',
                        bgcolor: '#FBF7FC',
                        borderRadius: '14px',
                        p: 0.5,
                        border: '1px solid rgba(139, 31, 158, 0.09)',
                        '& .MuiToggleButton-root': {
                            px: 2,
                            py: 1,
                            border: 0,
                            borderRadius: '11px !important',
                            textTransform: 'none',
                            fontWeight: 800,
                            color: '#777777',
                        },
                        '& .Mui-selected': {
                            bgcolor: 'rgba(193, 59, 219, 0.12) !important',
                            color: '#8B1F9E !important',
                        },
                    }}
                >
                    <ToggleButton value="PURCHASE">
                        {formatMessage({id: 'parkingPurchase.modePurchase'})}
                    </ToggleButton>

                    <ToggleButton value="RESERVATION">
                        {formatMessage({id: 'parkingPurchase.modeReservation'})}
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        </Paper>
    );
};

export default ParkingPurchaseModeCard;