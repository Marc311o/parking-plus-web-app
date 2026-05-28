import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {User} from '@api/Login/types';
import {fetchUserData} from "@api/Login";

type AuthState = {
    token: string | null;
    user: User | null;
    sessionExpired: boolean;

    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setBalance: (balance: number) => void;

    initialize: () => Promise<void>;

    logout: () => void;
    setSessionExpired: (expired: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            sessionExpired: false,

            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setSessionExpired: (expired) => set({ sessionExpired: expired }),

            setBalance: (balance) =>
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            balance,
                        }
                        : state.user,
                })),

            logout: () => set({ token: null, user: null }),

            initialize: async () => {
                const token = get().token;

                if (!token) return;

                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status === 401) {
                        set({ sessionExpired: true });
                        return;
                    }

                    if (!response.ok) throw new Error();

                    const userData = await response.json();
                    set({ user: userData });
                } catch {
                    // Only logout silently if it's not a 401 (which is handled by the interceptor or the check above)
                    if (!get().sessionExpired) {
                        get().logout();
                    }
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
);