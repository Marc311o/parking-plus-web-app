import {useAuthStore} from '@store/useAuthStore';

export const API_URL = import.meta.env.VITE_API_URL;

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

// Global fetch monkey-patch to catch 401s from any fetch call
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Check if the request returned 401
    // We ignore 401 on login attempts to handle incorrect credentials normally
    const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
    const isLoginRequest = url.includes('/auth/login') || url.includes('/auth/verify-mfa');
    
    if (response.status === 401 && !isLoginRequest) {
        console.log('Session expired detected via 401 response');
        useAuthStore.getState().setSessionExpired(true);
    }
    
    return response;
};

// Also export a wrapper just in case some code prefers it
export const authenticatedFetch = window.fetch;