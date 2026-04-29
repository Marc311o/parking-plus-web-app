// ENTRIES
export type EntriesPeriod = 'DAILY' | 'WEEKLY' | 'YEARLY';

export type EntriesPoint = {
    label: string;
    value: number;
};

export type EntriesResponse = {
    period: EntriesPeriod;
    from: string;
    to: string;
    total: number;
    points: EntriesPoint[];
};

//REVENUE
export type RevenuePeriod = 'DAILY' | 'WEEKLY' | 'YEARLY';

export type RevenuePoint = {
    label: string;
    date: string;
    value: number;
};

export type RevenueResponse = {
    period: RevenuePeriod;
    from: string;
    to: string;
    total: number;
    previousPeriodChangePercent: number;
    currency: string;
    points: RevenuePoint[];
};

//SPACE RANKING
export type ParkingFloor = 'A' | 'B';

export type ParkingSpaceRankingPoint = {
    spaceId: string;
    value: number;
};

export type ParkingSpaceRankingResponse = {
    floor: ParkingFloor;
    total: number;
    points: ParkingSpaceRankingPoint[];
};

//PARKING SPOTS
export type ParkingSpaceTimelineStatus = 'OCCUPIED' | 'RESERVED';

export type ParkingSpaceTimelineItem = {
    status: ParkingSpaceTimelineStatus;
    from: string;
    to: string;
};

export type ParkingSpaceTimelineResponse = {
    spaceId: string;
    date: string;
    items: ParkingSpaceTimelineItem[];
};