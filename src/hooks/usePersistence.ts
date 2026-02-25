import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../services/supabaseClient';

export const usePersistence = () => {
    const { activeLotId, getActiveLot, activeMarkers, selectedIdea, setHydratedData } = useStore() as any;
    const isInitialLoad = useRef(true);

    // 1. Initial Load: Fetch from Supabase
    useEffect(() => {
        const loadFromSupabase = async () => {
            try {
                const lot = getActiveLot();
                const lotId = await supabaseService.ensureProjectAndLot(lot);

                // Fetch markers
                const { data: dbMarkers } = await supabase
                    .from('active_markers')
                    .select('*')
                    .eq('lot_id', lotId);

                // Fetch idea
                const { data: dbIdea } = await supabase
                    .from('ai_ideas')
                    .select('*')
                    .eq('lot_id', lotId)
                    .single();

                if (dbMarkers || dbIdea) {
                    setHydratedData({
                        activeMarkers: dbMarkers || [],
                        selectedIdea: dbIdea || null
                    });
                }
            } catch (err) {
                console.error('Error loading from Supabase:', err);
            } finally {
                isInitialLoad.current = false;
            }
        };

        loadFromSupabase();
    }, [activeLotId]);

    // 2. Sync changes back to Supabase
    useEffect(() => {
        if (isInitialLoad.current) return;

        const syncToSupabase = async () => {
            try {
                const lot = getActiveLot();
                const lotId = await supabaseService.ensureProjectAndLot(lot);

                await supabaseService.syncMarkers(lotId, activeMarkers);
                await supabaseService.syncIdea(lotId, selectedIdea);
            } catch (err) {
                console.error('Error syncing to Supabase:', err);
            }
        };

        const timeout = setTimeout(syncToSupabase, 1000); // Debounce sync
        return () => clearTimeout(timeout);
    }, [activeMarkers, selectedIdea]);
};
