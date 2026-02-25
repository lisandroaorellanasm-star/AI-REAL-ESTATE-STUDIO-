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
        <div className="w-full h-full relative">
            {isLoading ? (
                <div className="absolute inset-0 bg-gray-900/90 flex flex-col items-center justify-center z-30 backdrop-blur-sm text-white">
                    <i className="fa-solid fa-palette fa-bounce text-4xl mb-3 text-blue-400"></i>
                    <p className="text-sm font-bold">{texts.paintingRender}</p>
                </div>
            ) : imageUrl ? (
                <div className="absolute inset-0 bg-black group">
                    <img src={imageUrl} alt="Generated Render" className="w-full h-full object-cover opacity-95 transition-opacity group-hover:opacity-100" />
                    <button onClick={handleGenerateRender} className="absolute bottom-3 right-3 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 shadow-lg">
                        <i className="fa-solid fa-rotate-right"></i>
                    </button>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 flex flex-col items-center justify-center p-4 text-center z-20">
                    <i className="fa-solid fa-camera-retro text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-[200px]">{texts.renderDesc}</p>
                    <button onClick={handleGenerateRender} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-5 rounded-full text-sm shadow-md transition-transform transform hover:scale-105 flex items-center gap-2">
                        <span>{texts.btnGenerateRender}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RenderPanel;
