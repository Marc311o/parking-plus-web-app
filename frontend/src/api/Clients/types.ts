export interface ClientDTO {
    id: number;
    name: string;
    surname: string;
    email: string;
    isOperator: boolean;
    isMfaEnabled: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface GetClientsParams {
    page: number;
    size: number;
    search?: string;
}