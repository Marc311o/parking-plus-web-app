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