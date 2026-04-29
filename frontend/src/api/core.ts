import {useAuthStore} from '@store/useAuthStore';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export const getAuthToken = () => {
    return useAuthStore.getState().token;
};

export const getHeaders = (): HeadersInit => {
    const token = getAuthToken();

    return {
        'Content-Type': 'application/json',
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
};