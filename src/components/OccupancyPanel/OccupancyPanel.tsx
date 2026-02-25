import React from 'react';
import { useStore } from '@/src/store';
import { Rnd } from 'react-rnd';

const OccupancyPanel = () => {
    const { occupancyRate, setOccupancyRate, activeMarkers } = useStore();

    const incomeUnits = activeMarkers.filter(m => m.type === 'cabana' || m.type === 'hotel' || m.type === 'restaurant' || m.type === 'cafe');

    return (
        <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">Ocupación:</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={occupancyRate}
                    onChange={(e) => setOccupancyRate(parseInt(e.target.value))}
                    className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="font-bold text-xs text-purple-600 dark:text-purple-400 min-w-[35px]">{occupancyRate}%</span>
            </div>

            {incomeUnits.length > 0 && (
                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-slate-700">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Activos:</span>
                    <div className="flex -space-x-1 overflow-hidden">
                        {Array.from(new Set(incomeUnits.map(u => u.type))).map(type => (
                            <div key={type} className="inline-block h-4 w-4 rounded-full ring-2 ring-white dark:ring-slate-800 bg-blue-100 dark:bg-blue-900 flex items-center justify-center" title={type}>
                                <span className="text-[8px] uppercase font-bold text-blue-700 dark:text-blue-300">
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
