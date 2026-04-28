import type {ReactNode} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';

type StatisticsAccordionTileProps = {
    title: string;
    description: string;
    expanded: boolean;
    onChange: () => void;
    children: ReactNode;
};

export const StatisticsAccordionTile = ({
                                            title,
                                            description,
                                            expanded,
                                            onChange,
                                            children,
                                        }: StatisticsAccordionTileProps) => {
    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            disableGutters
            elevation={0}
            sx={{
                borderRadius: '28px !important',
                border: '1px solid #F0EEF7',
                boxShadow: expanded
                    ? '0 18px 50px rgba(19, 16, 48, 0.08)'
                    : '0 12px 32px rgba(19, 16, 48, 0.055)',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
                background: expanded
                    ? 'linear-gradient(180deg, #FFFFFF 0%, #FBFAFF 100%)'
                    : '#FFFFFF',
                transition: '0.2s ease',
                '&::before': {
                    display: 'none',
                },
                '&:hover': {
                    boxShadow: '0 18px 50px rgba(19, 16, 48, 0.08)',
                    borderColor: '#E9E2F8',
                },
            }}
        >
            <AccordionSummary
                expandIcon={
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '14px',
                            bgcolor: expanded ? '#211C43' : '#F7F5FD',
                            color: expanded ? '#FFFFFF' : '#7A2DFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: '0.2s ease',
                        }}
                    >
                        <ExpandMoreIcon/>
                    </Box>
                }
                sx={{
                    minHeight: 112,
                    px: {
                        xs: 2.5,
                        md: 3.5,
                    },
                    py: 2.2,
                    '& .MuiAccordionSummary-content': {
                        my: 0,
                        alignItems: 'center',
                    },
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: '0.2s ease',
                    },
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(180deg)',
                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '18px',
                            bgcolor: expanded ? '#F1E9FF' : '#F7F5FD',
                            color: '#7A2DFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: '0.2s ease',
                        }}
                    >
                        <BarChartRoundedIcon sx={{fontSize: 25}}/>
                    </Box>

                    <Box sx={{minWidth: 0}}>
                        <Typography
                            sx={{
                                color: '#1F1A3D',
                                fontSize: {
                                    xs: 18,
                                    md: 21,
                                },
                                lineHeight: 1.15,
                                fontWeight: 900,
                                mb: 0.6,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{
                                color: '#8D87AA',
                                fontSize: 14,
                                fontWeight: 600,
                                lineHeight: 1.35,
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    px: {
                        xs: 2,
                        md: 3,
                    },
                    pt: 0,
                    pb: {
                        xs: 2.5,
                        md: 3,
                    },
                }}
            >
                {expanded && (
                    <Box
                        sx={{
                            pt: 2.5,
                            borderTop: '1px solid #F0EEF7',
                        }}
                    >
                        {children}
                    </Box>
                )}
            </AccordionDetails>
        </Accordion>
    );
};