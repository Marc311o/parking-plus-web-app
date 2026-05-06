import type {ReactNode} from 'react';
import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {useIntl} from "react-intl";

export interface ListViewColumn<T> {
    key: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render: (item: T) => ReactNode;
}

interface ListViewAction<T> {
    label: string;
    onClick: (item: T) => void;
}

interface ListViewPagination {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface ListViewProps<T extends { id: number | string }> {
    items: T[];
    columns: ListViewColumn<T>[];
    getIcon?: (item: T) => ReactNode;
    action?: ListViewAction<T>;
    pagination?: ListViewPagination;
    isLoading?: boolean;
    emptyMessage?: string;
}

export default function ListView<T extends { id: number | string }>({
                                                                        items,
                                                                        columns,
                                                                        getIcon,
                                                                        action,
                                                                        pagination,
                                                                        isLoading = false,
                                                                        emptyMessage,
                                                                    }: ListViewProps<T>) {
    const intl = useIntl();

    const currentPage = pagination?.page ?? 0;
    const totalPages = Math.max(pagination?.totalPages ?? 1, 1);

    const canGoPrevious = currentPage > 0;
    const canGoNext = currentPage + 1 < totalPages;

    const renderPagination = () => {
        if (!pagination) {
            return null;
        }

        return (
            <Box
                sx={{
                    minHeight: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    bgcolor: '#FFFFFF',
                }}
            >
                <IconButton
                    size="small"
                    disabled={!canGoPrevious}
                    onClick={() => pagination.onPageChange(currentPage - 1)}
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        color: '#8B1F9E',
                        bgcolor: canGoPrevious ? 'rgba(193, 59, 219, 0.08)' : 'transparent',
                        '&:hover': {
                            bgcolor: 'rgba(193, 59, 219, 0.14)',
                        },
                        '&.Mui-disabled': {
                            color: '#CFCFCF',
                            bgcolor: 'transparent',
                        },
                    }}
                >
                    <ChevronLeftRoundedIcon fontSize="small"/>
                </IconButton>

                <Typography
                    sx={{
                        minWidth: 58,
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#5F5F5F',
                    }}
                >
                    {currentPage + 1}/{totalPages}
                </Typography>

                <IconButton
                    size="small"
                    disabled={!canGoNext}
                    onClick={() => pagination.onPageChange(currentPage + 1)}
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        color: '#8B1F9E',
                        bgcolor: canGoNext ? 'rgba(193, 59, 219, 0.08)' : 'transparent',
                        '&:hover': {
                            bgcolor: 'rgba(193, 59, 219, 0.14)',
                        },
                        '&.Mui-disabled': {
                            color: '#CFCFCF',
                            bgcolor: 'transparent',
                        },
                    }}
                >
                    <ChevronRightRoundedIcon fontSize="small"/>
                </IconButton>
            </Box>
        );
    };

    if (isLoading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '18px',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 14px 34px rgba(20, 30, 55, 0.07)',
                }}
            >
                <Box
                    sx={{
                        p: 4,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress size={32}/>
                </Box>

                {renderPagination()}
            </Paper>
        );
    }

    if (items.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '18px',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 14px 34px rgba(20, 30, 55, 0.07)',
                }}
            >
                <Box
                    sx={{
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography sx={{fontSize: 15, color: '#8A8A8A'}}>
                        {emptyMessage ?? intl.formatMessage({id: 'common.lackOfData'})}
                    </Typography>
                </Box>

                {renderPagination()}
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '18px',
                bgcolor: '#FFFFFF',
                boxShadow: '0 14px 34px rgba(20, 30, 55, 0.07)',
            }}
        >
            {items.map((item, index) => (
                <Box
                    key={item.id}
                    sx={{
                        minHeight: 72,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: action ? '48px 1fr auto' : '48px 1fr',
                            md: action
                                ? `64px ${columns.map((column) => column.width ?? '1fr').join(' ')} auto`
                                : `64px ${columns.map((column) => column.width ?? '1fr').join(' ')}`,
                        },
                        alignItems: 'center',
                        gap: {xs: 1.5, md: 2},
                        px: {xs: 2, md: 3},
                        bgcolor: '#F5EAF6',
                        borderBottom: index < items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {getIcon?.(item)}
                    </Box>

                    {columns.map((column) => (
                        <Box
                            key={column.key}
                            sx={{
                                display: {xs: column.key === columns[0].key ? 'block' : 'none', md: 'block'},
                                textAlign: column.align ?? 'left',
                                minWidth: 0,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: '#202020',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {column.render(item)}
                            </Typography>
                        </Box>
                    ))}

                    {action && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => action.onClick(item)}
                            sx={{
                                minWidth: 74,
                                height: 28,
                                px: 1.5,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#FFFFFF',
                                boxShadow: 'none',
                                background: 'linear-gradient(90deg, #C13BDB 0%, #8B1F9E 100%)',
                                '&:hover': {
                                    boxShadow: 'none',
                                    background: 'linear-gradient(90deg, #B632CF 0%, #7D1B8F 100%)',
                                },
                            }}
                        >
                            {action.label}
                        </Button>
                    )}
                </Box>
            ))}

            {renderPagination()}
        </Paper>
    );
}