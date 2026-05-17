export const MOCK_WALLET_BALANCE = 120;
export const MOCK_WALLET_CURRENCY = 'PLN';

export const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const toTimeInputValue = (date: Date) => date.toTimeString().slice(0, 5);

export const addHours = (date: Date, hours: number) => {
    const nextDate = new Date(date);

    nextDate.setHours(nextDate.getHours() + hours);
    nextDate.setSeconds(0);
    nextDate.setMilliseconds(0);

    return nextDate;
};

export const getCurrentDateTimeValue = () => {
    const now = new Date();

    now.setSeconds(0);
    now.setMilliseconds(0);

    return `${toDateInputValue(now)}T${toTimeInputValue(now)}:00`;
};

export const buildDateTime = (date: string, time: string) => {
    if (!date || !time) {
        return null;
    }

    return `${date}T${time}:00`;
};

export const formatMoney = (value: number, currency = 'PLN') =>
    new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency,
    }).format(value);

export const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));