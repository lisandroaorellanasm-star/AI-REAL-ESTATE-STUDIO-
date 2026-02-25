import React, { useState } from 'react';
import { useStore } from '@/src/store';
import { generateRender } from '@/src/services/geminiService';
import { dict } from '@/src/data/i18n';
import { itemDefs } from '@/src/data/lotes';

const RenderPanel = () => {
    const { activeMarkers, currentLang } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const texts = dict[currentLang];

    const handleGenerateRender = async () => {
        setIsLoading(true);
        setImageUrl(null);

        const counts: { [key: string]: number } = {};
        activeMarkers.forEach(m => {
            counts[m.type] = (counts[m.type] || 0) + 1;
        });
        const itemsText: string[] = [];
        for (const key in counts) {
            if (counts[key] > 0) {
                const name = currentLang === 'es' ? itemDefs[key].nameEs : itemDefs[key].nameEn;
                itemsText.push(`${counts[key]} ${name}${counts[key] > 1 ? 's' : ''}`);
            }
        }

        const result = await generateRender(itemsText.join(', '), activeMarkers);
        if (result) {
            setImageUrl(result);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full h-full relative group">
            {isLoading ? (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-30 backdrop-blur-2xl text-white">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                        <i className="fa-solid fa-palette fa-bounce text-5xl text-purple-400 relative z-10"></i>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse text-white/60">{texts.paintingRender}</p>
                </div>
            ) : imageUrl ? (
                <div className="absolute inset-0 bg-black overflow-hidden rounded-[2rem]">
                    <img src={imageUrl} alt="Generated Render" className="w-full h-full object-cover opacity-90 transition-all group-hover:opacity-100 group-hover:scale-105 duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <button onClick={handleGenerateRender} className="absolute bottom-5 right-5 bg-white/10 hover:bg-purple-600 text-white p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-2xl group/btn">
                        <i className="fa-solid fa-rotate-right group-hover/btn:rotate-180 transition-transform duration-500 text-sm"></i>
                    </button>
                    <div className="absolute bottom-5 left-8">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">Vista Generada por IA</span>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center z-20">
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-full"></div>
                        <i className="fa-solid fa-camera-viewfinder text-5xl text-white/10 relative z-10"></i>
                    </div>
                    <p className="text-[11px] text-white/30 mb-8 max-w-[220px] leading-relaxed font-medium italic">{texts.renderDesc}</p>
                    <button onClick={handleGenerateRender} className="bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 text-xs uppercase tracking-[0.2em] border border-white/10">
                        <i className="fa-solid fa-microchip"></i>
                        <span>{texts.btnGenerateRender}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RenderPanel;
