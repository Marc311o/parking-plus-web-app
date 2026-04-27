import {ReactNode} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type StatisticsAccordionTileProps = {
    title: string;
    description: string;
    children: ReactNode;
    defaultExpanded?: boolean;
};

export const StatisticsAccordionTile = ({
                                            title,
                                            description,
                                            children,
                                            defaultExpanded = false,
                                        }: StatisticsAccordionTileProps) => {
    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            disableGutters
            elevation={0}
            sx={{
                borderRadius: '24px !important',
                border: '1px solid #F0EEF7',
                boxShadow: '0 14px 40px rgba(19, 16, 48, 0.06)',
                overflow: 'hidden',
                bgcolor: '#FFFFFF',
                '&::before': {
                    display: 'none',
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
                            bgcolor: '#F7F5FD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#7A2DFF',
                        }}
                    >
                        <ExpandMoreIcon />
                    </Box>
                }
                sx={{
                    minHeight: 86,
                    px: 3,
                    py: 1.5,
                    '& .MuiAccordionSummary-content': {
                        m: 0,
                        alignItems: 'center',
                    },
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: '#1F1A3D',
                            fontSize: 18,
                            fontWeight: 900,
                            mb: 0.4,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        {description}
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 0,
                }}
            >
                {children}
            </AccordionDetails>
        </Accordion>
    );
};