import {useEffect, useMemo, useState} from 'react';
import {Box, Avatar} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useSearchParams} from 'react-router-dom';

import ListView, {type ListViewColumn} from '@components/Common/ListView';
import EventDetailsDialog from "@components/Events/EventDetailsDialog";

import {getEvents} from '@api/Events/events';
import type {ParkingEventDTO} from '@api/Events';

import {useIntl} from 'react-intl';

const EventsPage = () => {
    const {formatMessage} = useIntl();

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 0);
    const search = searchParams.get('search') ?? '';

    const entryChecked = searchParams.get('entry') !== 'false';
    const exitChecked = searchParams.get('exit') !== 'false';

    const [events, setEvents] = useState<ParkingEventDTO[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [size, setSize] = useState(10);

    const [selectedEvent, setSelectedEvent] = useState<ParkingEventDTO | null>(null);

    const totalPages = Math.max(Math.ceil(totalElements / size), 1);

    useEffect(() => {
        let isMounted = true;

        const fetchEvents = async () => {
            setIsLoading(true);

            try {
                const result = await getEvents({
                    page,
                    size,
                    search,
                    entry: entryChecked,
                    exit: exitChecked,
                });

                if (!isMounted) return;

                setEvents(result.content);
                setTotalElements(result.totalElements);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void fetchEvents();

        return () => {
            isMounted = false;
        };
    }, [page, size, search, entryChecked, exitChecked]);

    const columns = useMemo<ListViewColumn<ParkingEventDTO>[]>(() => [
        {
            key: 'date',
            width: '0.8fr',
            render: (item) => {
                const color = item.eventType === 'ENTRY' ? '#2e7d32' : '#d32f2f';
                const [date] = item.eventDate.split(' ');
                const [y, m, d] = date.split('-');

                return <span style={{color, fontWeight: 600}}>{`${d}.${m}.${y}`}</span>;
            },
        },
        {
            key: 'time',
            width: '0.8fr',
            render: (item) => {
                const color = item.eventType === 'ENTRY' ? '#2e7d32' : '#d32f2f';
                return <span style={{color, fontWeight: 600}}>{item.eventDate.split(' ')[1]}</span>;
            },
        },
        {
            key: 'type',
            width: '1fr',
            render: (item) => {
                const color = item.eventType === 'ENTRY' ? '#2e7d32' : '#d32f2f';
                return (
                    <span style={{color, fontWeight: 600}}>
                        {item.eventType === 'ENTRY' ? formatMessage({id: 'events.entry'}).toUpperCase() : formatMessage({id: 'events.exit'}).toUpperCase()}
                    </span>
                );
            },
        },
        {
            key: 'plateNumber',
            width: '1fr',
            render: (item) => {
                const color = item.eventType === 'ENTRY' ? '#2e7d32' : '#d32f2f';
                return <span style={{color, fontWeight: 600}}>{item.plateNumber}</span>;
            },
        },
    ], []);

    const handlePageChange = (nextPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(nextPage));
        setSearchParams(nextParams);
    };

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5}}>

            <ListView
                items={events}
                isLoading={isLoading}
                emptyMessage={formatMessage({id: 'events.list.empty'})}
                columns={columns}
                pagination={{
                    page,
                    totalPages,
                    onPageChange: handlePageChange,
                }}
                getIcon={(item: ParkingEventDTO) => {
                    const isEntry = item.eventType === 'ENTRY';

                    return (
                        <Avatar
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: 'transparent',
                                color: isEntry ? '#2e7d32' : '#d32f2f',
                            }}
                        >
                            {isEntry ? <ArrowDropUpIcon sx={{fontSize: 48}} /> : <ArrowDropDownIcon sx={{fontSize: 48}} />}
                        </Avatar>
                    );
                }}
                action={{
                    label: formatMessage({id: 'events.list.details'}),
                    onClick: (e) => setSelectedEvent(e),
                }}
            />

            <EventDetailsDialog
                open={Boolean(selectedEvent)}
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </Box>
    );
};

export default EventsPage;