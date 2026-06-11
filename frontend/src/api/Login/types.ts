export type User = {
    id: number;
    name: string;
    surname: string;
    email: string;
    balance: number;
    isOperator: boolean;
    isMfaEnabled: boolean;
};