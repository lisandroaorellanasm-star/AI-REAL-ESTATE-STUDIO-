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
        <div id="inventory-panel" className="relative w-full z-[50] bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 flex flex-col shadow-2xl transition-all mb-2 group">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]"></div>
                    <span>Configuración de Equipamiento</span>
                </h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
                        <i className="fa-solid fa-eye text-[10px] text-white/40"></i>
                        <input type="range" id="opacity-slider" min="20" max="100" value={opacity} className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600" onChange={handleOpacityChange} title="Visibilidad" />
                    </div>
                </div>
            </div>
            <div id="inventory-list" className="flex overflow-x-auto gap-4 pb-2 items-center px-1 snap-x scroll-smooth custom-scrollbar">
                {Object.entries(itemDefs).map(([type, def]) => (
                    <div key={type} className="flex flex-col items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-3 shadow-lg min-w-[100px] snap-center shrink-0 transition-all hover:bg-purple-600/10 hover:border-purple-500/30 group/item">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-2xl ${def.colorClass} mb-3 transform group-hover/item:scale-110 transition-transform`} dangerouslySetInnerHTML={{ __html: def.iconHtml }}></div>
                        <span className="font-black text-white text-[10px] uppercase tracking-tighter mb-3 text-center leading-tight opacity-60 group-hover/item:opacity-100">{def.nameEs}</span>
                        <div className="flex items-center bg-black/40 rounded-xl border border-white/5 w-full justify-between p-1">
                            <button onClick={() => removeMarker(type)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 font-bold focus:outline-none flex items-center justify-center transition-all border border-transparent">-</button>
                            <span className="text-center font-black text-white text-xs flex-1">{counts[type]}</span>
                            <button onClick={() => addMarker(type)} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/40 hover:text-green-400 font-bold focus:outline-none flex items-center justify-center transition-all border border-transparent">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryPanel;
