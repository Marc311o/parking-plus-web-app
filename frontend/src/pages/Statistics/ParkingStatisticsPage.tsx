import {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {ParkingEntriesChart} from '@components/Statistics';
import {type EntriesResponse} from '@api/Statistics';

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

const ParkingStatisticsPage = () => {
    const [selectedWeekStart, setSelectedWeekStart] = useState(getStartOfCurrentWeek());
    const [entriesData, setEntriesData] = useState<EntriesResponse>(
        createMockEntriesForWeek(getStartOfCurrentWeek())
    );

    useEffect(() => {
        const from = toIsoDate(selectedWeekStart);

        // Docelowo tutaj będzie pobieranie danych z backendu:
        //
        // const fetchEntries = async () => {
        //     try {
        //         const data = await fetchNieWiemJakSieBacieNazywam(from);
        //         setEntriesData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setEntriesData(createMockEntriesForWeek(selectedWeekStart));
        //     }
        // };
        //
        // fetchEntries();

        setEntriesData(createMockEntriesForWeek(selectedWeekStart)); //TODO WYWAL
    }, [selectedWeekStart]);

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

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}
        >
            <ParkingEntriesChart
                data={entriesData}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onCurrentWeek={handleCurrentWeek}
                onWeekSelect={handleWeekSelect}
            />
        </Box>
    );
};

export default ParkingStatisticsPage;