import React from 'react';
import { useStore } from '@/src/store';
import { Rnd } from 'react-rnd';

const OccupancyPanel = () => {
    const { occupancyRate, setOccupancyRate, activeMarkers } = useStore();

    const incomeUnits = activeMarkers.filter(m => m.type === 'cabana' || m.type === 'hotel' || m.type === 'restaurant' || m.type === 'cafe');

    return (
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-black text-white/40 tracking-widest whitespace-nowrap">Ocupación IA:</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={occupancyRate}
                    onChange={(e) => setOccupancyRate(parseInt(e.target.value))}
                    className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="font-black text-xs text-purple-400 min-w-[35px]">{occupancyRate}%</span>
            </div>

            {incomeUnits.length > 0 && (
                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10">
                    <span className="text-[9px] uppercase font-black text-white/20 tracking-tighter">Activos:</span>
                    <div className="flex -space-x-1.5 overflow-hidden">
                        {Array.from(new Set(incomeUnits.map(u => u.type))).map(type => (
                            <div key={type} className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-950 bg-purple-600/30 border border-purple-500/50 flex items-center justify-center shadow-lg" title={type}>
                                <span className="text-[9px] uppercase font-black text-purple-200">
                                    {type.charAt(0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OccupancyPanel;
