import { useState, useEffect } from 'react';
import { Idea } from '@/src/types';
import { useStore } from '@/src/store';
import { generateIdeas } from '@/src/services/geminiService';

export const useIdeas = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeLotId, getActiveLot, currentLang, selectIdea } = useStore();

    useEffect(() => {
        const fetchIdeas = async () => {
            setIsLoading(true);
            const activeLot = getActiveLot();
            const area = `${(activeLot.areaM2 * 1.431).toLocaleString('en-US', { minimumFractionDigits: 2 })} v²`;
            const result = await generateIdeas(area, currentLang);
            if (result && result.ideas) {
                setIdeas(result.ideas);
                if (result.ideas.length > 0) {
                    selectIdea(result.ideas[0]);
                }
            }
            setIsLoading(false);
        };
        fetchIdeas();
    }, [activeLotId, currentLang]);

    return { ideas, isLoading };
};
