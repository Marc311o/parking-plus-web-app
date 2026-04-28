// ENTRIES
export type EntriesPoint = {
    label: string;
    value: number;
};

export type EntriesResponse = {
    from: string;
    to: string;
    total: number;
    points: EntriesPoint[];
};

export type WeekOption = {
    from: string;
    to: string;
    label: string;
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