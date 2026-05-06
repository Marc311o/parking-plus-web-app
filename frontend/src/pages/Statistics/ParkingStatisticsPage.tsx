import {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    ParkingAverageStayChart,
    ParkingEntriesChart,
    ParkingRevenueChart,
    ParkingSpaceRankingChart,
    StatisticsAccordionTile,
} from '@components/Statistics';
import {
    type AverageStayPeriod,
    type AverageStayResponse,
    type EntriesPeriod,
    type EntriesResponse,
    getEntriesStats,
    type ParkingFloor,
    type ParkingSpaceRankingResponse,
    type RevenuePeriod,
    type RevenueResponse,
} from '@api/Statistics';

type ExpandedStatistic =
    | 'entries'
    | 'revenue'
    | 'averageStay'
    | 'spaceRanking'
    | null;

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getDateFromIso = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const addDays = (date: Date, days: number) => {
    const copiedDate = new Date(date);

    copiedDate.setDate(copiedDate.getDate() + days);
    copiedDate.setHours(12, 0, 0, 0);

    return copiedDate;
};

const getStartOfCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    today.setDate(today.getDate() + diffToMonday);
    today.setHours(12, 0, 0, 0);

    return today;
};

const getStartOfCurrentYear = () => {
    const today = new Date();

    return new Date(today.getFullYear(), 0, 1, 12, 0, 0, 0);
};

const getStartOfCurrentMonth = () => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1, 12, 0, 0, 0);
};


const createMockRevenue = (
    period: RevenuePeriod,
    fromDate: Date
): RevenueResponse => {
    const year = fromDate.getFullYear();

    if (period === 'YEARLY') {
        return {
            period: 'YEARLY',
            from: `${year}-01-01`,
            to: `${year}-12-31`,
            total: 35703,
            previousPeriodChangePercent: 1.3,
            currency: 'PLN',
            points: [
                {label: 'JAN', date: `${year}-01-01`, value: 2600},
                {label: 'FEB', date: `${year}-02-01`, value: 3300},
                {label: 'MAR', date: `${year}-03-01`, value: 2100},
                {label: 'APR', date: `${year}-04-01`, value: 3000},
                {label: 'MAY', date: `${year}-05-01`, value: 4000},
                {label: 'JUN', date: `${year}-06-01`, value: 3200},
                {label: 'JUL', date: `${year}-07-01`, value: 3800},
                {label: 'AUG', date: `${year}-08-01`, value: 3600},
                {label: 'SEP', date: `${year}-09-01`, value: 2800},
                {label: 'OCT', date: `${year}-10-01`, value: 2700},
                {label: 'NOV', date: `${year}-11-01`, value: 2300},
                {label: 'DEC', date: `${year}-12-01`, value: 3700},
            ],
        };
    }

    if (period === 'WEEKLY') {
        const weekEnd = addDays(fromDate, 6);

        return {
            period: 'WEEKLY',
            from: toIsoDate(fromDate),
            to: toIsoDate(weekEnd),
            total: 9210,
            previousPeriodChangePercent: -2.4,
            currency: 'PLN',
            points: [
                {label: 'MON', date: toIsoDate(fromDate), value: 1200},
                {label: 'TUE', date: toIsoDate(addDays(fromDate, 1)), value: 980},
                {label: 'WED', date: toIsoDate(addDays(fromDate, 2)), value: 1460},
                {label: 'THU', date: toIsoDate(addDays(fromDate, 3)), value: 1180},
                {label: 'FRI', date: toIsoDate(addDays(fromDate, 4)), value: 2050},
                {label: 'SAT', date: toIsoDate(addDays(fromDate, 5)), value: 1320},
                {label: 'SUN', date: toIsoDate(addDays(fromDate, 6)), value: 1020},
            ],
        };
    }

    return {
        period: 'DAILY',
        from: toIsoDate(fromDate),
        to: toIsoDate(fromDate),
        total: 1840,
        previousPeriodChangePercent: 4.8,
        currency: 'PLN',
        points: [
            {label: '00:00', date: `${toIsoDate(fromDate)}T00:00:00`, value: 0},
            {label: '02:00', date: `${toIsoDate(fromDate)}T02:00:00`, value: 80},
            {label: '04:00', date: `${toIsoDate(fromDate)}T04:00:00`, value: 120},
            {label: '06:00', date: `${toIsoDate(fromDate)}T06:00:00`, value: 230},
            {label: '08:00', date: `${toIsoDate(fromDate)}T08:00:00`, value: 410},
            {label: '10:00', date: `${toIsoDate(fromDate)}T10:00:00`, value: 520},
            {label: '12:00', date: `${toIsoDate(fromDate)}T12:00:00`, value: 690},
            {label: '14:00', date: `${toIsoDate(fromDate)}T14:00:00`, value: 760},
            {label: '16:00', date: `${toIsoDate(fromDate)}T16:00:00`, value: 910},
            {label: '18:00', date: `${toIsoDate(fromDate)}T18:00:00`, value: 1030},
            {label: '20:00', date: `${toIsoDate(fromDate)}T20:00:00`, value: 1280},
            {label: '22:00', date: `${toIsoDate(fromDate)}T22:00:00`, value: 1840},
        ],
    };
};

const createMockAverageStay = (
    period: AverageStayPeriod,
    fromDate: Date
): AverageStayResponse => {
    const year = fromDate.getFullYear();

    if (period === 'YEARLY') {
        return {
            period: 'YEARLY',
            from: `${year}-01-01`,
            to: `${year}-12-31`,
            overallAverageMinutes: 142,
            categories: [
                {spaceType: 'REGULAR_ABLEBODIED', averageMinutes: 156},
                {spaceType: 'REGULAR_HANDICAPED', averageMinutes: 118},
                {spaceType: 'EV_ABLEBODIED', averageMinutes: 132},
                {spaceType: 'EV_HANDICAPED', averageMinutes: 96},
                {spaceType: 'REGULAR_BOTH', averageMinutes: 144},
                {spaceType: 'EV_BOTH', averageMinutes: 105},
            ],
        };
    }

    if (period === 'WEEKLY') {
        const weekEnd = addDays(fromDate, 6);

        return {
            period: 'WEEKLY',
            from: toIsoDate(fromDate),
            to: toIsoDate(weekEnd),
            overallAverageMinutes: 151,
            categories: [
                {spaceType: 'REGULAR_ABLEBODIED', averageMinutes: 164},
                {spaceType: 'REGULAR_HANDICAPED', averageMinutes: 126},
                {spaceType: 'EV_ABLEBODIED', averageMinutes: 138},
                {spaceType: 'EV_HANDICAPED', averageMinutes: 101},
                {spaceType: 'REGULAR_BOTH', averageMinutes: 150},
                {spaceType: 'EV_BOTH', averageMinutes: 112},
            ],
        };
    }

    return {
        period: 'DAILY',
        from: toIsoDate(fromDate),
        to: toIsoDate(fromDate),
        overallAverageMinutes: 156,
        categories: [
            {spaceType: 'REGULAR_ABLEBODIED', averageMinutes: 156},
            {spaceType: 'REGULAR_HANDICAPED', averageMinutes: 112},
            {spaceType: 'EV_ABLEBODIED', averageMinutes: 128},
            {spaceType: 'EV_HANDICAPED', averageMinutes: 84},
            {spaceType: 'REGULAR_BOTH', averageMinutes: 139},
            {spaceType: 'EV_BOTH', averageMinutes: 64},
        ],
    };
};

const createMockSpaceRanking = (
    date: string,
    floor: ParkingFloor
): ParkingSpaceRankingResponse => {
    const dateSeed = Number(date.replaceAll('-', '')) % 7;

    const points = Array.from({length: 28}, (_, index) => {
        const spaceNumber = index + 1;
        const baseValue = 34 - index;
        const randomLikeOffset = (index * 7 + dateSeed) % 9;

        return {
            spaceId: `${floor}${spaceNumber}`,
            value: Math.max(3, baseValue + randomLikeOffset),
        };
    }).sort((firstPoint, secondPoint) => secondPoint.value - firstPoint.value);

    return {
        floor,
        total: points.reduce((sum, point) => sum + point.value, 0),
        points,
    };
};

const ParkingStatisticsPage = () => {
    const {formatMessage} = useIntl();

    const [expandedStatistic, setExpandedStatistic] =
        useState<ExpandedStatistic>(null);

    const [selectedEntriesPeriod, setSelectedEntriesPeriod] =
        useState<EntriesPeriod>('WEEKLY');

    const [selectedEntriesDate, setSelectedEntriesDate] = useState(
        toIsoDate(getStartOfCurrentWeek())
    );

    const [entriesData, setEntriesData] = useState<EntriesResponse | null>(null);

    const [selectedRevenuePeriod, setSelectedRevenuePeriod] =
        useState<RevenuePeriod>('YEARLY');

    const [selectedRevenueFrom, setSelectedRevenueFrom] =
        useState(getStartOfCurrentYear());

    const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);

    const [selectedAverageStayPeriod, setSelectedAverageStayPeriod] =
        useState<AverageStayPeriod>('DAILY');

    const [selectedAverageStayDate, setSelectedAverageStayDate] = useState(
        toIsoDate(new Date())
    );

    const [averageStayData, setAverageStayData] =
        useState<AverageStayResponse | null>(null);

    const [selectedSpaceRankingDate, setSelectedSpaceRankingDate] = useState(
        toIsoDate(new Date())
    );

    const [selectedSpaceRankingFloor, setSelectedSpaceRankingFloor] =
        useState<ParkingFloor>('A');

    const [spaceRankingData, setSpaceRankingData] =
        useState<ParkingSpaceRankingResponse | null>(null);

    const handleAccordionChange = (statistic: ExpandedStatistic) => {
        setExpandedStatistic((current) => (current === statistic ? null : statistic));
    };

    useEffect(() => {
        if (expandedStatistic !== 'entries') {
            return;
        }

        let isMounted = true;

        const fetchEntries = async () => {
            try {
                const data = await getEntriesStats(
                    selectedEntriesDate,
                    selectedEntriesPeriod
                );

                if (!isMounted) {
                    return;
                }

                setEntriesData(data);
            } catch (error) {
                console.error('Failed to fetch parking entries statistics:', error);

                if (!isMounted) {
                    return;
                }
            }
        };

        void fetchEntries();

        return () => {
            isMounted = false;
        };
    }, [expandedStatistic, selectedEntriesPeriod, selectedEntriesDate]);

    useEffect(() => {
        if (expandedStatistic !== 'revenue') {
            return;
        }

        const from = toIsoDate(selectedRevenueFrom);

        // Docelowo backend:
        //
        // const fetchRevenue = async () => {
        //     try {
        //         const response = await fetch(
        //             `/api/statistics/parking/revenue?period=${selectedRevenuePeriod}&from=${from}`
        //         );
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch parking revenue statistics');
        //         }
        //
        //         const data: RevenueResponse = await response.json();
        //
        //         setRevenueData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setRevenueData(
        //             createMockRevenue(selectedRevenuePeriod, selectedRevenueFrom)
        //         );
        //     }
        // };
        //
        // fetchRevenue();

        setRevenueData(createMockRevenue(selectedRevenuePeriod, selectedRevenueFrom));
    }, [expandedStatistic, selectedRevenuePeriod, selectedRevenueFrom]);

    useEffect(() => {
        if (expandedStatistic !== 'averageStay') {
            return;
        }

        // Docelowo backend:
        //
        // const fetchAverageStay = async () => {
        //     try {
        //         const response = await fetch(
        //             `/api/statistics/parking/average-stay?period=${selectedAverageStayPeriod}&from=${selectedAverageStayDate}`
        //         );
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch average stay statistics');
        //         }
        //
        //         const data: AverageStayResponse = await response.json();
        //
        //         setAverageStayData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setAverageStayData(
        //             createMockAverageStay(
        //                 selectedAverageStayPeriod,
        //                 getDateFromIso(selectedAverageStayDate)
        //             )
        //         );
        //     }
        // };
        //
        // fetchAverageStay();

        setAverageStayData(
            createMockAverageStay(
                selectedAverageStayPeriod,
                getDateFromIso(selectedAverageStayDate)
            )
        );
    }, [expandedStatistic, selectedAverageStayPeriod, selectedAverageStayDate]);

    useEffect(() => {
        if (expandedStatistic !== 'spaceRanking') {
            return;
        }

        // Docelowo backend:
        //
        // const fetchSpaceRanking = async () => {
        //     try {
        //         const response = await fetch(
        //             `/api/statistics/parking/space-ranking?date=${selectedSpaceRankingDate}&floor=${selectedSpaceRankingFloor}`
        //         );
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch parking space ranking');
        //         }
        //
        //         const data: ParkingSpaceRankingResponse = await response.json();
        //
        //         setSpaceRankingData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setSpaceRankingData(
        //             createMockSpaceRanking(
        //                 selectedSpaceRankingDate,
        //                 selectedSpaceRankingFloor
        //             )
        //         );
        //     }
        // };
        //
        // fetchSpaceRanking();

        setSpaceRankingData(
            createMockSpaceRanking(selectedSpaceRankingDate, selectedSpaceRankingFloor)
        );
    }, [expandedStatistic, selectedSpaceRankingDate, selectedSpaceRankingFloor]);

    const handleEntriesPeriodChange = (period: EntriesPeriod) => {
        setSelectedEntriesPeriod(period);

        if (period === 'YEARLY') {
            setSelectedEntriesDate(toIsoDate(getStartOfCurrentYear()));
            return;
        }

        if (period === 'WEEKLY') {
            setSelectedEntriesDate(toIsoDate(getStartOfCurrentWeek()));
            return;
        }

        setSelectedEntriesDate(toIsoDate(new Date()));
    };

    const handleRevenuePeriodChange = (period: RevenuePeriod) => {
        setSelectedRevenuePeriod(period);

        if (period === 'YEARLY') {
            setSelectedRevenueFrom(getStartOfCurrentYear());
            return;
        }

        if (period === 'WEEKLY') {
            setSelectedRevenueFrom(getStartOfCurrentWeek());
            return;
        }

        setSelectedRevenueFrom(getStartOfCurrentMonth());
    };

    const handleAverageStayPeriodChange = (period: AverageStayPeriod) => {
        setSelectedAverageStayPeriod(period);

        if (period === 'YEARLY') {
            setSelectedAverageStayDate(toIsoDate(getStartOfCurrentYear()));
            return;
        }

        if (period === 'WEEKLY') {
            setSelectedAverageStayDate(toIsoDate(getStartOfCurrentWeek()));
            return;
        }

        setSelectedAverageStayDate(toIsoDate(new Date()));
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.entries.tileTitle'})}
                description={formatMessage({id: 'statistics.entries.tileDescription'})}
                expanded={expandedStatistic === 'entries'}
                onChange={() => handleAccordionChange('entries')}
            >
                {entriesData && (
                    <ParkingEntriesChart
                        data={entriesData}
                        selectedPeriod={selectedEntriesPeriod}
                        selectedDate={selectedEntriesDate}
                        onPeriodChange={handleEntriesPeriodChange}
                        onDateChange={setSelectedEntriesDate}
                    />
                )}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.revenue.tileTitle'})}
                description={formatMessage({id: 'statistics.revenue.tileDescription'})}
                expanded={expandedStatistic === 'revenue'}
                onChange={() => handleAccordionChange('revenue')}
            >
                {revenueData && (
                    <ParkingRevenueChart
                        data={revenueData}
                        selectedPeriod={selectedRevenuePeriod}
                        selectedDate={toIsoDate(selectedRevenueFrom)}
                        onPeriodChange={handleRevenuePeriodChange}
                        onDateChange={(date) =>
                            setSelectedRevenueFrom(getDateFromIso(date))
                        }
                    />
                )}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.averageStay.tileTitle'})}
                description={formatMessage({id: 'statistics.averageStay.tileDescription'})}
                expanded={expandedStatistic === 'averageStay'}
                onChange={() => handleAccordionChange('averageStay')}
            >
                {averageStayData && (
                    <ParkingAverageStayChart
                        data={averageStayData}
                        selectedPeriod={selectedAverageStayPeriod}
                        selectedDate={selectedAverageStayDate}
                        onPeriodChange={handleAverageStayPeriodChange}
                        onDateChange={setSelectedAverageStayDate}
                    />
                )}
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.spaceRanking.tileTitle'})}
                description={formatMessage({id: 'statistics.spaceRanking.tileDescription'})}
                expanded={expandedStatistic === 'spaceRanking'}
                onChange={() => handleAccordionChange('spaceRanking')}
            >
                {spaceRankingData && (
                    <ParkingSpaceRankingChart
                        data={spaceRankingData}
                        selectedDate={selectedSpaceRankingDate}
                        selectedFloor={selectedSpaceRankingFloor}
                        floors={['A', 'B']}
                        onDateChange={setSelectedSpaceRankingDate}
                        onFloorChange={setSelectedSpaceRankingFloor}
                    />
                )}
            </StatisticsAccordionTile>
        </Box>
    );
};

export default ParkingStatisticsPage;