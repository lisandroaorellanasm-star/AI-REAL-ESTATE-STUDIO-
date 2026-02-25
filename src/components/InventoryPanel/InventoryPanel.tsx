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
        <div id="inventory-panel" className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-3 flex flex-col shadow-2xl scale-100 origin-bottom transition-all hover:bg-white/70 dark:hover:bg-slate-900/80">
            <div className="flex justify-between items-center mb-3 px-3">
                <h3 className="font-black text-xs uppercase tracking-widest text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <i className="fa-solid fa-shapes"></i> <span>Añadir / Quitar Unidades</span>
                </h3>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase hidden sm:flex items-center gap-1.5"><i className="fa-solid fa-hand-pointer"></i> <span>Interactúa con los iconos</span></span>
                    <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 rounded-full px-3 py-1 border border-purple-200 dark:border-purple-800">
                        <i className="fa-solid fa-adjust text-[10px] text-purple-600 dark:text-purple-400"></i>
                        <input type="range" id="opacity-slider" min="20" max="100" value={opacity} className="w-20 h-1.5 bg-purple-200 dark:bg-purple-700 rounded-lg appearance-none cursor-pointer accent-purple-600" onChange={handleOpacityChange} title="Visibilidad de Marcadores" />
                    </div>
                </div>
            </div>
            <div id="inventory-list" className="flex overflow-x-auto gap-3 pb-2 items-center px-1 snap-x scroll-smooth custom-scrollbar">
                {Object.entries(itemDefs).map(([type, def]) => (
                    <div key={type} className="flex flex-col items-center justify-between bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 rounded-2xl p-2.5 shadow-md min-w-[85px] snap-center shrink-0 transition-transform active:scale-95 group">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg ${def.colorClass} mb-2 transform group-hover:scale-110 transition-transform`} dangerouslySetInnerHTML={{ __html: def.iconHtml }}></div>
                        <span className="font-extrabold text-gray-800 dark:text-gray-100 text-[10px] mb-2 text-center leading-tight">{def.nameEs}</span>
                        <div className="flex items-center bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 w-full justify-between p-1">
                            <button onClick={() => removeMarker(type)} className="w-6 h-6 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 font-black focus:outline-none flex items-center justify-center transition-colors border border-transparent hover:border-red-200">-</button>
                            <span className="text-center font-black text-purple-700 dark:text-purple-400 text-xs flex-1">{counts[type]}</span>
                            <button onClick={() => addMarker(type)} className="w-6 h-6 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-500 font-black focus:outline-none flex items-center justify-center transition-colors border border-transparent hover:border-green-200">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryPanel;
