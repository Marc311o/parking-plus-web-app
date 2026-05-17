import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {User} from '@api/Login/types';
import {fetchUserData} from "@api/Login";

type AuthState = {
    token: string | null;
    user: User | null;

    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setBalance: (balance: number) => void;

    initialize: () => Promise<void>;

    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,

            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),

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
                    const userData = await fetchUserData(token);

                    set({
                        user: userData,
                    });
                } catch {
                    get().logout();
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
);