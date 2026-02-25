import React from 'react';
import { useStore } from '@/src/store';
import { Rnd } from 'react-rnd';

const OccupancyPanel = () => {
    const { occupancyRate, setOccupancyRate, activeMarkers } = useStore();

    const incomeUnits = activeMarkers.filter(m => m.type === 'cabana' || m.type === 'hotel' || m.type === 'restaurant' || m.type === 'cafe');

    return (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
            <div className="p-4">
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">Análisis de Ocupación</h4>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Tasa:</span>
                    <input type="range" min="0" max="100" value={occupancyRate} onChange={(e) => setOccupancyRate(parseInt(e.target.value))} className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    <span className="font-bold text-xs min-w-[30px]">{occupancyRate}%</span>
                </div>
                {incomeUnits.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-2">
                        <h5 className="font-bold text-[10px] uppercase text-gray-400 mb-1">Unidades de Ingreso:</h5>
                        <div className="flex flex-wrap gap-1">
                            {incomeUnits.map(unit => (
                                <span key={unit.id} className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">{unit.type}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OccupancyPanel;
