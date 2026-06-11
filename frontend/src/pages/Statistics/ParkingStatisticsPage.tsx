import React, {useEffect, useState, useCallback} from 'react';
import {Box, CircularProgress, Alert, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    ParkingAverageStayChart,
    ParkingEntriesChart,
    ParkingRevenueChart,
    ParkingSpaceRankingChart,
    StatisticsAccordionTile,
} from '@components/Statistics';
import {
    getAverageStayStats,
    getEntriesStats,
    getParkingSpaceRanking,
    getRevenueStats,
} from '@api/Statistics';
import type {
    AverageStayPeriod,
    AverageStayResponse,
    EntriesPeriod,
    EntriesResponse,
    ParkingFloor,
    ParkingSpaceRankingResponse,
    RevenuePeriod,
    RevenueResponse,
} from '@api/Statistics';

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ParkingStatisticsPage = () => {
    const {formatMessage} = useIntl();

    const [expandedTile, setExpandedTile] = useState<string | null>('entries');

    const [entriesPeriod, setEntriesPeriod] = useState<EntriesPeriod>('WEEKLY');
    const [entriesDate, setEntriesDate] = useState(toIsoDate(new Date()));
    const [entriesData, setEntriesData] = useState<EntriesResponse | null>(null);

    const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('WEEKLY');
    const [revenueDate, setRevenueDate] = useState(toIsoDate(new Date()));
    const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);

    const [averageStayPeriod, setAverageStayPeriod] =
        useState<AverageStayPeriod>('YEARLY');
    const [averageStayDate, setAverageStayDate] = useState(toIsoDate(new Date()));
    const [averageStayData, setAverageStayData] =
        useState<AverageStayResponse | null>(null);

    const [rankingPeriod, setRankingPeriod] = useState<EntriesPeriod>('DAILY');
    const [selectedSpaceRankingDate, setSelectedSpaceRankingDate] = useState(
        toIsoDate(new Date())
    );
    const [selectedSpaceRankingFloor, setSelectedSpaceRankingFloor] =
        useState<ParkingFloor>('A');
    const [spaceRankingData, setSpaceRankingData] =
        useState<ParkingSpaceRankingResponse | null>(null);

    const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
    const [fetchError, setFetchError] = useState<{ [key: string]: string | null }>({});

    const fetchEntries = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, entries: true }));
        setFetchError(prev => ({ ...prev, entries: null }));
        try {
            const data = await getEntriesStats(entriesDate, entriesPeriod);
            setEntriesData(data);
        } catch (e: any) {
            console.error(e);
            setFetchError(prev => ({ ...prev, entries: e.message || 'Error' }));
        } finally {
            setIsLoading(prev => ({ ...prev, entries: false }));
        }
    }, [entriesDate, entriesPeriod]);

    const fetchRevenue = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, revenue: true }));
        setFetchError(prev => ({ ...prev, revenue: null }));
        try {
            const data = await getRevenueStats(revenueDate, revenuePeriod);
            setRevenueData(data);
        } catch (e: any) {
            console.error(e);
            setFetchError(prev => ({ ...prev, revenue: e.message || 'Error' }));
        } finally {
            setIsLoading(prev => ({ ...prev, revenue: false }));
        }
    }, [revenueDate, revenuePeriod]);

    const fetchAverageStay = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, averageStay: true }));
        setFetchError(prev => ({ ...prev, averageStay: null }));
        try {
            const data = await getAverageStayStats(averageStayDate, averageStayPeriod);
            setAverageStayData(data);
        } catch (e: any) {
            console.error(e);
            setFetchError(prev => ({ ...prev, averageStay: e.message || 'Error' }));
        } finally {
            setIsLoading(prev => ({ ...prev, averageStay: false }));
        }
    }, [averageStayDate, averageStayPeriod]);

    const fetchRanking = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, ranking: true }));
        setFetchError(prev => ({ ...prev, ranking: null }));
        try {
            const data = await getParkingSpaceRanking(selectedSpaceRankingDate, rankingPeriod, selectedSpaceRankingFloor);
            setSpaceRankingData(data);
        } catch (e: any) {
            console.error(e);
            setFetchError(prev => ({ ...prev, ranking: e.message || 'Error' }));
        } finally {
            setIsLoading(prev => ({ ...prev, ranking: false }));
        }
    }, [selectedSpaceRankingDate, rankingPeriod, selectedSpaceRankingFloor]);

    useEffect(() => { void fetchEntries(); }, [fetchEntries]);
    useEffect(() => { void fetchRevenue(); }, [fetchRevenue]);
    useEffect(() => { void fetchAverageStay(); }, [fetchAverageStay]);
    useEffect(() => { void fetchRanking(); }, [fetchRanking]);

    const renderChart = (key: string, data: any, component: React.ReactNode) => {
        if (fetchError[key]) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    {fetchError[key]}
                </Alert>
            );
        }
        if (isLoading[key] && !data) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                    <CircularProgress color="primary" />
                </Box>
            );
        }
        if (!data && !isLoading[key]) {
             return <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Brak danych do wyświetlenia.</Typography>;
        }
        return data ? component : null;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.entries.title'})}
                description={formatMessage({id: 'statistics.entries.tileDescription'})}
                expanded={expandedTile === 'entries'}
                onChange={() => setExpandedTile(expandedTile === 'entries' ? null : 'entries')}
            >
                {renderChart('entries', entriesData, (
                    <ParkingEntriesChart
                        data={entriesData!}
                        selectedPeriod={entriesPeriod}
                        selectedDate={entriesDate}
                        onPeriodChange={setEntriesPeriod}
                        onDateChange={setEntriesDate}
                    />
                ))}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.revenue.title'})}
                description={formatMessage({id: 'statistics.revenue.totalDescription'})}
                expanded={expandedTile === 'revenue'}
                onChange={() => setExpandedTile(expandedTile === 'revenue' ? null : 'revenue')}
            >
                {renderChart('revenue', revenueData, (
                    <ParkingRevenueChart
                        data={revenueData!}
                        selectedPeriod={revenuePeriod}
                        selectedDate={revenueDate}
                        onPeriodChange={setRevenuePeriod}
                        onDateChange={setRevenueDate}
                    />
                ))}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.averageStay.title'})}
                description={formatMessage({id: 'statistics.averageStay.totalDescription'})}
                expanded={expandedTile === 'averageStay'}
                onChange={() => setExpandedTile(expandedTile === 'averageStay' ? null : 'averageStay')}
            >
                {renderChart('averageStay', averageStayData, (
                    <ParkingAverageStayChart
                        data={averageStayData!}
                        selectedPeriod={averageStayPeriod}
                        selectedDate={averageStayDate}
                        onPeriodChange={setAverageStayPeriod}
                        onDateChange={setAverageStayDate}
                    />
                ))}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.spaceRanking.title'})}
                description={formatMessage({id: 'statistics.spaceRanking.tileDescription'})}
                expanded={expandedTile === 'ranking'}
                onChange={() => setExpandedTile(expandedTile === 'ranking' ? null : 'ranking')}
            >
                {renderChart('ranking', spaceRankingData, (
                    <ParkingSpaceRankingChart
                        data={spaceRankingData!}
                        selectedPeriod={rankingPeriod}
                        selectedDate={selectedSpaceRankingDate}
                        selectedFloor={selectedSpaceRankingFloor}
                        floors={['A', 'B']}
                        onPeriodChange={setRankingPeriod}
                        onDateChange={setSelectedSpaceRankingDate}
                        onFloorChange={setSelectedSpaceRankingFloor}
                    />
                ))}
            </StatisticsAccordionTile>
        </Box>
    );
};

export default ParkingStatisticsPage;