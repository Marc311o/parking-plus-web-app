import {Box, ButtonBase, Typography} from '@mui/material';
import type {ParkingLevel} from '@api/types.ts';

interface ParkingLevelSwitchProps {
    value: ParkingLevel;
    onChange: (level: ParkingLevel) => void;
}

const ParkingLevelSwitch = ({value, onChange}: ParkingLevelSwitchProps) => {
    const levels: ParkingLevel[] = ['B', 'A'];

    return (
        <Box
            sx={{
                width: 44,
                height: '100%',
                minWidth: 44,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#D9D9DE',
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                overflow: 'hidden',
                borderLeft: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            {levels.map((level, index) => {
                const active = value === level;

                return (
                    <ButtonBase
                        key={level}
                        onClick={() => onChange(level)}
                        sx={{
                            flex: 1,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: active ? '#BFC0C5' : 'transparent',
                            borderTop:
                                index === 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                                bgcolor: active ? '#BFC0C5' : '#CECFD4',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#111111',
                                lineHeight: 1,
                            }}
                        >
                            {level}
                        </Typography>
                    </ButtonBase>
                );
            })}
        </Box>
    );
};

export default ParkingLevelSwitch;