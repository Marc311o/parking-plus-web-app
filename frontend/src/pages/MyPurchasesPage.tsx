import { useEffect, useMemo, useState } from 'react';
import { Box, Avatar, Alert } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useSearchParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import ListView, {
    type ListViewColumn,
} from '@components/Common/ListView';

import { useAuthStore } from '@store/useAuthStore';

import type { PurchaseDetailsDTO } from '@api/MyPurchases';
import { getPurchasesByUser } from '@api/MyPurchases/mypurchases';


const formatDateTime = (
    dateString: string | null | undefined
): string => {
    if (!dateString) {
        return '-';
    }

    return new Date(dateString).toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const MyPurchasesPage = () => {
    const { formatMessage } = useIntl();

    const token = useAuthStore((state) => state.token);

    const [searchParams, setSearchParams] =
        useSearchParams();

    const startDate =
        searchParams.get('startDate') ?? '';

    const endDate =
        searchParams.get('endDate') ?? '';

    const showAll =
        searchParams.get('showAll') === 'true';

    const [purchases, setPurchases] = useState<
        PurchaseDetailsDTO[]
    >([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] = useState<
        string | null
    >(null);

    const page = Number(
        searchParams.get('page') ?? 0
    );

    const size = 10;


    const filteredPurchases = useMemo(() => {
        if (showAll) {
            return purchases;
        }

        return purchases.filter((purchase) => {
            const purchaseStart = new Date(
                purchase.startTime
            );

            if (startDate) {
                const start = new Date(startDate);

                if (purchaseStart < start) {
                    return false;
                }
            }

            if (endDate) {
                const end = new Date(endDate);

                end.setHours(
                    23,
                    59,
                    59,
                    999
                );

                if (purchaseStart > end) {
                    return false;
                }
            }

            return true;
        });
    }, [
        purchases,
        startDate,
        endDate,
        showAll,
    ]);

    useEffect(() => {
        if (!token) return;

        let isMounted = true;

        const fetchPurchases = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result =
                    await getPurchasesByUser(token);

                if (!isMounted) return;

                setPurchases(result);
            } catch (error) {
                if (!isMounted) return;

                setPurchases([]);

                const message =
                    error instanceof Error
                        ? error.message
                        : formatMessage({
                            id: 'common.error',
                        });

                setError(message);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchPurchases();

        return () => {
            isMounted = false;
        };
    }, [token, formatMessage]);

    const totalPages = Math.max(
        Math.ceil(
            filteredPurchases.length / size
        ),
        1
    );

    const pagedPurchases = useMemo(() => {
        const start = page * size;

        return filteredPurchases.slice(
            start,
            start + size
        );
    }, [
        filteredPurchases,
        page,
    ]);

    const handlePageChange = (
        nextPage: number
    ) => {
        const nextParams =
            new URLSearchParams(
                searchParams
            );

        nextParams.set(
            'page',
            String(nextPage)
        );

        setSearchParams(nextParams);
    };

    const columns = useMemo<
        ListViewColumn<PurchaseDetailsDTO>[]
    >(
        () => [
            {
                key: 'licensePlate',
                width: '1fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 700,
                            color: '#7F0F96',
                        }}
                    >
                        {item.licensePlate}
                    </span>
                ),
            },
            {
                key: 'start_time',
                width: '1.2fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 600,
                            color: '#7F0F96',
                        }}
                    >
                        {formatMessage({
                            id: 'myPurchases.start',
                        })}
                        : {formatDateTime(item.startTime)}
                    </span>
                ),
            },
            {
                key: 'end_time',
                width: '1.2fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 600,
                            color: '#7F0F96',
                        }}
                    >
                        {formatMessage({
                            id: 'myPurchases.end',
                        })}
                        : {formatDateTime(item.endTime) ?? '-'}
                    </span>
                ),
            },
            {
                key: 'price',
                width: '0.8fr',
                render: (item) => (
                    <span
                        style={{
                            fontWeight: 700,
                            color: '#2e7d32',
                        }}
                    >
                        {item.price != null
                            ? `${item.price.toFixed(2)} zł`
                            : '-'}
                    </span>
                ),
            },
        ],
        [formatMessage]
    );

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            {error && (
                <Alert
                    severity="error"
                    onClose={() =>
                        setError(null)
                    }
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <ListView
                items={pagedPurchases}
                isLoading={isLoading}
                emptyMessage={formatMessage({
                    id: 'myPurchases.emptyMessage',
                })}
                columns={columns}
                pagination={{
                    page,
                    totalPages,
                    onPageChange:
                    handlePageChange,
                }}
                getIcon={() => (
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            bgcolor:
                                'transparent',
                            color: '#7F0F96',
                        }}
                    >
                        <ShoppingBagIcon />
                    </Avatar>
                )}
            />
        </Box>
    );
};

export default MyPurchasesPage;