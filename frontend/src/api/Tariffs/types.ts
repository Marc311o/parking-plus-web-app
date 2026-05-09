export interface TariffDTO {
    id?: number;
    isDaily?: boolean;
    daily?: boolean;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    isFirstHour?: boolean;
    firstHour?: boolean;
    price: number;
}