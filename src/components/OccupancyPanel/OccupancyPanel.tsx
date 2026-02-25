import React from 'react';
import { useStore } from '@/src/store';
import { Rnd } from 'react-rnd';

const OccupancyPanel = () => {
    const { occupancyRate, setOccupancyRate, activeMarkers } = useStore();

    const incomeUnits = activeMarkers.filter(m => m.type === 'cabana' || m.type === 'hotel' || m.type === 'restaurant' || m.type === 'cafe');

    return (
        <Rnd
            default={{
                x: window.innerWidth - 450,
                y: 50,
                width: 400,
                height: 'auto',
            }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg"
        >
            <div className="p-4">
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-3">Análisis de Ocupación</h4>
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs">Tasa de Ocupación:</span>
                    <input type="range" min="0" max="100" value={occupancyRate} onChange={(e) => setOccupancyRate(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    <span className="font-bold">{occupancyRate}%</span>
                </div>
                <div>
                    <h5 className="font-bold text-xs mb-2">Unidades de Ingreso:</h5>
                    <ul>
                        {incomeUnits.map(unit => (
                            <li key={unit.id} className="text-xs">{unit.type}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Rnd>
    );
};

export default OccupancyPanel;
