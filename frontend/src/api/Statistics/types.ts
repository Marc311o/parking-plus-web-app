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