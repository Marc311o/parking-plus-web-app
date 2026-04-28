import {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    ParkingEntriesChart,
    ParkingRevenueChart,
    StatisticsAccordionTile,
} from '@components/Statistics';
import {
    type EntriesResponse,
    type RevenuePeriod,
    type RevenueResponse,
} from '@api/Statistics';

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

const createMockEntriesForWeek = (weekStart: Date): EntriesResponse => {
    const weekEnd = addDays(weekStart, 6);

    return {
        from: toIsoDate(weekStart),
        to: toIsoDate(weekEnd),
        total: 193,
        points: [
            {label: 'MON', value: 33},
            {label: 'TUE', value: 13},
            {label: 'WED', value: 35},
            {label: 'THU', value: 20},
            {label: 'FRI', value: 50},
            {label: 'SAT', value: 10},
            {label: 'SUN', value: 30},
        ],
    };
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
        from: `${year}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-01`,
        to: `${year}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-30`,
        total: 18450,
        previousPeriodChangePercent: 4.8,
        currency: 'PLN',
        points: [
            {label: '01', date: `${year}-03-01`, value: 410},
            {label: '02', date: `${year}-03-02`, value: 520},
            {label: '03', date: `${year}-03-03`, value: 460},
            {label: '04', date: `${year}-03-04`, value: 610},
            {label: '05', date: `${year}-03-05`, value: 700},
            {label: '06', date: `${year}-03-06`, value: 850},
            {label: '07', date: `${year}-03-07`, value: 760},
            {label: '08', date: `${year}-03-08`, value: 690},
            {label: '09', date: `${year}-03-09`, value: 720},
            {label: '10', date: `${year}-03-10`, value: 640},
        ],
    };
};

const ParkingStatisticsPage = () => {
    const {formatMessage} = useIntl();

    const [selectedWeekStart, setSelectedWeekStart] = useState(getStartOfCurrentWeek());

    const [entriesData, setEntriesData] = useState<EntriesResponse>(
        createMockEntriesForWeek(getStartOfCurrentWeek())
    );

    const [selectedRevenuePeriod, setSelectedRevenuePeriod] =
        useState<RevenuePeriod>('YEARLY');

    const [selectedRevenueFrom, setSelectedRevenueFrom] = useState(getStartOfCurrentYear());

    const [revenueData, setRevenueData] = useState<RevenueResponse>(
        createMockRevenue('YEARLY', getStartOfCurrentYear())
    );

    useEffect(() => {
        const from = toIsoDate(selectedWeekStart);

        // Docelowo backend:
        //
        // const fetchEntries = async () => {
        //     try {
        //         const response = await fetch(`/api/statistics/parking/entries?from=${from}`);
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch parking entries statistics');
        //         }
        //
        //         const data: EntriesResponse = await response.json();
        //
        //         setEntriesData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setEntriesData(createMockEntriesForWeek(selectedWeekStart));
        //     }
        // };
        //
        // fetchEntries();

        setEntriesData(createMockEntriesForWeek(selectedWeekStart));
    }, [selectedWeekStart]);

    useEffect(() => {
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
        //         setRevenueData(createMockRevenue(selectedRevenuePeriod, selectedRevenueFrom));
        //     }
        // };
        //
        // fetchRevenue();

        setRevenueData(createMockRevenue(selectedRevenuePeriod, selectedRevenueFrom));
    }, [selectedRevenuePeriod, selectedRevenueFrom]);

    const handlePreviousWeek = () => {
        setSelectedWeekStart((current) => addDays(current, -7));
    };

    const handleNextWeek = () => {
        setSelectedWeekStart((current) => addDays(current, 7));
    };

    const handleCurrentWeek = () => {
        setSelectedWeekStart(getStartOfCurrentWeek());
    };

    const handleWeekSelect = (weekStart: string) => {
        setSelectedWeekStart(getDateFromIso(weekStart));
    };

    const handleRevenuePeriodChange = (period: RevenuePeriod) => {
        setSelectedRevenuePeriod(period);

        if (period === 'YEARLY') {
            setSelectedRevenueFrom(getStartOfCurrentYear());
        }

        if (period === 'WEEKLY') {
            setSelectedRevenueFrom(getStartOfCurrentWeek());
        }

        if (period === 'DAILY') {
            const today = new Date();
            setSelectedRevenueFrom(new Date(today.getFullYear(), today.getMonth(), 1, 12));
        }
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
            >
                <ParkingEntriesChart
                    data={entriesData}
                    onWeekSelect={handleWeekSelect}
                />
            </StatisticsAccordionTile>

            <StatisticsAccordionTile
                title={formatMessage({id: 'statistics.revenue.tileTitle'})}
                description={formatMessage({id: 'statistics.revenue.tileDescription'})}
            >
                <ParkingRevenueChart
                    data={revenueData}
                    selectedPeriod={selectedRevenuePeriod}
                    selectedDate={toIsoDate(selectedRevenueFrom)}
                    onPeriodChange={handleRevenuePeriodChange}
                    onDateChange={(date) => setSelectedRevenueFrom(getDateFromIso(date))}
                />
            </StatisticsAccordionTile>
        </Box>
    );
};

export default ParkingStatisticsPage;