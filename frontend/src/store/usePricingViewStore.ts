import { create } from 'zustand';

type PricingViewState = {
    view: 'hourly' | 'daily';
    setView: (view: 'hourly' | 'daily') => void;
};

export const usePricingViewStore = create<PricingViewState>((set) => ({
    view: 'hourly',
    setView: (view) => set({ view }),
}));