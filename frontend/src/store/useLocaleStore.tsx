import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type Locale = 'pl' | 'en';

type LocaleState = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: 'en',
            setLocale: (locale) => set({ locale }),
        }),
        {
            name: 'locale-storage',
        }
    )
);