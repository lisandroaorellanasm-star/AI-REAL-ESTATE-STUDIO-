import React, { useState } from 'react';
import { useStore } from '@/src/store';
import { itemDefs } from '@/src/data/lotes';

const InventoryPanel = () => {
    const { activeMarkers, addMarker, removeMarker } = useStore();
    const [opacity, setOpacity] = useState(80);

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpacity = parseInt(e.target.value, 10);
        setOpacity(newOpacity);
        document.documentElement.style.setProperty('--marker-opacity', (newOpacity / 100).toString());
    };

    const counts: { [key: string]: number } = {};
    for (const key in itemDefs) counts[key] = 0;
    activeMarkers.forEach(m => counts[m.type] = (counts[m.type] || 0) + 1);

    return (
        <div id="inventory-panel" className="absolute top-2 left-2 right-2 z-[1000] bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl p-2 flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-2 px-2">
                <h3 className="font-bold text-[11px] text-gray-800 dark:text-gray-100 drop-shadow-sm flex items-center gap-1.5">
                    <i className="fa-solid fa-cubes text-purple-600 dark:text-purple-400"></i> <span>Añadir / Quitar</span>
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] text-gray-600 dark:text-gray-300 font-medium italic hidden sm:flex items-center gap-1"><i className="fa-solid fa-arrows-up-down-left-right"></i> <span>Arrastra los iconos</span></span>
                    <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
                        <i className="fa-solid fa-eye-dropper text-[9px] text-gray-600 dark:text-gray-300"></i>
                        <input type="range" id="opacity-slider" min="20" max="100" value={opacity} className="w-16 h-1.5 bg-gray-300/80 dark:bg-gray-600/80 rounded-lg appearance-none cursor-pointer" onChange={handleOpacityChange} title="Intensidad Visual" />
                    </div>
                </div>
            </div>
            <div id="inventory-list" className="flex overflow-x-auto gap-2 pb-1 items-center px-1 snap-x scroll-smooth">
                {Object.entries(itemDefs).map(([type, def]) => (
                    <div key={type} className="flex flex-col items-center justify-between bg-white/60 dark:bg-black/30 backdrop-blur border border-white/50 dark:border-white/10 rounded-xl p-1.5 shadow-sm min-w-[65px] snap-center shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md ${def.colorClass} mb-1`} dangerouslySetInnerHTML={{ __html: def.iconHtml }}></div>
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-[9px] mb-1.5 text-center leading-tight tracking-tight">{def.nameEs}</span>
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner w-full justify-between px-1 py-0.5">
                            <button onClick={() => removeMarker(type)} className="w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-black focus:outline-none flex items-center justify-center transition-colors">-</button>
                            <span className="text-center font-black text-purple-700 dark:text-purple-400 text-[10px] flex-1">{counts[type]}</span>
                            <button onClick={() => addMarker(type)} className="w-4 h-4 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-black focus:outline-none flex items-center justify-center transition-colors">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryPanel;
