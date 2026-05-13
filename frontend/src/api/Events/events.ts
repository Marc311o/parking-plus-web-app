import {API_URL, getHeaders} from '../core';
import type {GetEventsParams, ParkingEventDTO} from './types';
import {MOCK_EVENTS} from './mock';

type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
};

export const getEvents = async ({
                                    page,
                                    size,
                                    search = '',
                                    entry = true,
                                    exit = true,
                                }: GetEventsParams): Promise<PageResponse<ParkingEventDTO>> => {


    // todo change
    let data = [...MOCK_EVENTS];

    if (search.trim()) {
        data = data.filter(e =>
            e.plateNumber.toLowerCase().includes(search.toLowerCase())
        );
    }

    data = data.filter(e => {
        if (e.eventType === 'ENTRY' && !entry) return false;
        if (e.eventType === 'EXIT' && !exit) return false;
        return true;
    });

    const totalElements = data.length;


    const start = page * size;
    const content = data.slice(start, start + size);

    return {
        content,
        totalElements,
        totalPages: Math.max(Math.ceil(totalElements / size), 1),
    };
};