import { supabase } from './supabaseClient';
import { Idea, ActiveMarker, Lote } from '../types';

export const supabaseService = {
    async ensureProjectAndLot(lot: Lote) {
        // 1. Ensure project exists (default project for now)
        let { data: project, error: pError } = await supabase
            .from('projects')
            .select('id')
            .eq('name', 'Default Project')
            .single();

        if (!project) {
            const { data: newP, error: newPError } = await supabase
                .from('projects')
                .insert({ name: 'Default Project' })
                .select()
                .single();
            project = newP;
            if (newPError) throw newPError;
        }

        // 2. Ensure lot exists
        let { data: dbLot, error: lError } = await supabase
            .from('lots')
            .select('id')
            .eq('name', lot.nameKey)
            .eq('project_id', project!.id)
            .single();

        if (!dbLot) {
            const { data: newL, error: newLError } = await supabase
                .from('lots')
                .insert({
                    project_id: project!.id,
                    name: lot.nameKey,
                    area_m2: lot.areaM2,
                    coordinates_json: lot.coordenadas_utm, // Using utm as placeholder if coordenadas is missing
                    utm_json: lot.coordenadas_utm
                })
                .select()
                .single();
            dbLot = newL;
            if (newLError) throw newLError;
        }

        return dbLot.id;
    },

    async syncMarkers(lotId: string, markers: ActiveMarker[]) {
        // Delete old markers for this lot
        await supabase.from('active_markers').delete().eq('lot_id', lotId);

        // Insert new ones
        if (markers.length > 0) {
            const dbMarkers = markers.map(m => ({
                id: m.id,
                lot_id: lotId,
                type: m.type,
                lat: m.lat,
                lng: m.lng
            }));
            await supabase.from('active_markers').insert(dbMarkers);
        }
    },

    async syncIdea(lotId: string, idea: Idea | null) {
        if (!idea) {
            await supabase.from('ai_ideas').delete().eq('lot_id', lotId);
            return;
        }

        const { data: existing } = await supabase
            .from('ai_ideas')
            .select('id')
            .eq('lot_id', lotId)
            .eq('title', idea.title)
            .single();

        if (existing) {
            await supabase.from('ai_ideas').update({
                summary: idea.summary,
                elements: idea.elements
            }).eq('id', existing.id);
        } else {
            await supabase.from('ai_ideas').insert({
                lot_id: lotId,
                title: idea.title,
                summary: idea.summary,
                elements: idea.elements
            });
        }
    }
};
