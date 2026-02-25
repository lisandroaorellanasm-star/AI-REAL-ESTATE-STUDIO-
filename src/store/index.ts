import { create } from 'zustand';
import { Lote, Idea, ActiveMarker } from '@/src/types';
import { lotes } from '@/src/data/lotes';
import { getValidRandomLatLng } from '../utils/coordinates';
import L from 'leaflet';

interface AppState {
    activeLotId: string;
    setActiveLotId: (id: string) => void;
    getActiveLot: () => Lote;
    isDarkMode: boolean;
    toggleTheme: () => void;
    currentLang: 'es' | 'en';
    toggleLanguage: () => void;
    selectedIdea: Idea | null;
    activeMarkers: ActiveMarker[];
    selectIdea: (idea: Idea) => void;
    addMarker: (type: string) => void;
    removeMarker: (type: string) => void;
    updateMarkerPosition: (id: string, lat: number, lng: number) => void;
    itemCosts: { [key: string]: number };
    updateItemCost: (itemType: string, newCost: number) => void;
    landCost: number;
    setLandCost: (newCost: number) => void;
    isMusicPlaying: boolean;
    toggleMusic: () => void;
    musicVolume: number;
    setMusicVolume: (volume: number) => void;
    occupancyRate: number;
    setOccupancyRate: (rate: number) => void;
    setHydratedData: (data: { activeMarkers: ActiveMarker[], selectedIdea: Idea | null }) => void;
    user: any;
    setUser: (user: any) => void;
}

export const useStore = create<AppState>((set, get) => ({
    itemCosts: {},
    updateItemCost: (itemType: string, newCost: number) => {
        set(state => ({
            itemCosts: { ...state.itemCosts, [itemType]: newCost }
        }));
    },
    landCost: 0,
    setLandCost: (newCost: number) => set({ landCost: newCost }),
    isMusicPlaying: false,
    toggleMusic: () => set(state => ({ isMusicPlaying: !state.isMusicPlaying })),
    musicVolume: 0.5,
    setMusicVolume: (volume: number) => set({ musicVolume: volume }),
    occupancyRate: 75,
    setOccupancyRate: (rate: number) => set({ occupancyRate: rate }),
    activeLotId: lotes[0].id,
    setActiveLotId: (id) => {
        set({ activeLotId: id, selectedIdea: null, activeMarkers: [] });
    },
    getActiveLot: () => lotes.find(l => l.id === get().activeLotId) || lotes[0],
    isDarkMode: false,
    toggleTheme: () => set(state => ({ isDarkMode: !state.isDarkMode })),
    currentLang: 'es',
    toggleLanguage: () => set(state => ({ currentLang: state.currentLang === 'es' ? 'en' : 'es' })),
    selectedIdea: null,
    activeMarkers: [],
    selectIdea: (idea) => {
        const newMarkers: ActiveMarker[] = [];
        const activeLot = get().getActiveLot();

        const addItem = (type: string) => {
            const pos = getValidRandomLatLng(activeLot);
            newMarkers.push({ id: `${type}-${Date.now()}-${Math.random()}`, type, ...pos });
        };

        const str = idea.elements.join(" ").toLowerCase();
        if (str.includes("hotel")) addItem('hotel');
        if (str.includes("cabaña")) { for (let i = 0; i < 4; i++) addItem('cabana'); }
        if (str.includes("piscina")) addItem('piscina');
        if (str.includes("yoga")) addItem('yoga');
        addItem('parqueo');
        addItem('hierbas');

        set({ selectedIdea: idea, activeMarkers: newMarkers });
    },
    addMarker: (type) => {
        const activeLot = get().getActiveLot();
        const pos = getValidRandomLatLng(activeLot);
        const newMarker: ActiveMarker = { id: `${type}-${Date.now()}-${Math.random()}`, type, ...pos };
        set(state => ({ activeMarkers: [...state.activeMarkers, newMarker] }));
    },
    removeMarker: (type) => {
        set(state => {
            const markers = [...state.activeMarkers];
            const index = markers.reverse().findIndex(m => m.type === type);
            if (index !== -1) {
                markers.splice(index, 1);
            }
            return { activeMarkers: markers.reverse() };
        });
    },
    updateMarkerPosition: (id, lat, lng) => {
        set(state => ({
            activeMarkers: state.activeMarkers.map(m => m.id === id ? { ...m, lat, lng } : m)
        }));
    },
    setHydratedData: (data) => set({
        activeMarkers: data.activeMarkers,
        selectedIdea: data.selectedIdea
    }),
    user: null,
    setUser: (user) => set({ user })
}));

