// ENTRIES
export type EntriesPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

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
export type RevenuePeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

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

//AVARAGE STAY
export type AverageStayPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type ParkingSpaceType =
    | 'REGULAR_ABLEBODIED'
    | 'REGULAR_HANDICAPED'
    | 'EV_ABLEBODIED'
    | 'EV_HANDICAPED'
    | 'REGULAR_BOTH'
    | 'EV_BOTH';

export type AverageStayCategoryItem = {
    spaceType: ParkingSpaceType;
    averageMinutes: number;
};

export type AverageStayResponse = {
    period: AverageStayPeriod;
    from: string;
    to: string;
    overallAverageMinutes: number;
    categories: AverageStayCategoryItem[];
};

//SPACE RANKING
export type ParkingFloor = 'A' | 'B';

export type ParkingSpaceRankingPoint = {
    spaceId: string;
    value: number;
};

export type ParkingSpaceRankingResponse = {
    floor: ParkingFloor;
    period: EntriesPeriod;
    from: string;
    to: string;
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