import React, { useState, useEffect } from 'react';
import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';
import { itemDefs } from '@/src/data/lotes';
import { generateMarketAnalysis } from '@/src/services/geminiService';

const RoiPanel = () => {
    const { getActiveLot, activeMarkers, currentLang, itemCosts, updateItemCost, landCost, setLandCost } = useStore();
    const [roiPercentage, setRoiPercentage] = useState(16); // Default to 16%
    const [marketAnalysis, setMarketAnalysis] = useState('');

    const handleMarketAnalysis = async () => {
        const context = {
            totalInvestment,
            roiPercentage,
            items: activeMarkers.map(m => m.type),
        };
        const analysis = await generateMarketAnalysis(context, currentLang);
        setMarketAnalysis(analysis);
    };

    useEffect(() => {
        const activeLot = getActiveLot();
        const areaVaras = activeLot.areaM2 * 1.431;
        const initialLandCost = Math.round(areaVaras * 100);
        if (landCost === 0) { // Only set initial cost if it hasn't been set
            setLandCost(initialLandCost);
        }
    }, [getActiveLot, setLandCost, landCost]);
    const texts = dict[currentLang];
    const activeLot = getActiveLot();

    const counts: { [key: string]: number } = {};
    activeMarkers.forEach(m => {
        counts[m.type] = (counts[m.type] || 0) + 1;
    });

    const totalInfraCost = Object.entries(counts).reduce((acc, [type, count]) => {
        const cost = (itemCosts[type] ?? itemDefs[type]?.cost) || 0;
        return acc + (count * cost);
    }, 0);

    const totalInvestment = landCost + totalInfraCost;
    const recoveryYears = 100 / roiPercentage;

    let totalConstructionM2 = 0;
    activeMarkers.forEach(m => {
        totalConstructionM2 += itemDefs[m.type]?.constructionM2 || 0;
    });

    const availableAreaM2 = activeLot.areaM2 - totalConstructionM2;

    return (
        <div className="p-4 sm:p-6 overflow-y-auto h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                    <h4 className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide mb-1">{texts.roiCostLand}</h4>
                    
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                    <h4 className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wide mb-1">{texts.roiCostInfra}</h4>
                    <p className="text-2xl font-black text-gray-800 dark:text-white">${totalInfraCost.toLocaleString('en-US')}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 mb-6">
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-3">Desglose de Inversión</h4>
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                    <div className="grid grid-cols-4 gap-2 font-bold text-gray-500 dark:text-gray-400 mb-2">
                        <span className="col-span-1">Item</span>
                        <span className="text-right">Costo Unit.</span>
                        <span className="text-right">Área (m²)</span>
                        <span className="text-right">Subtotal</span>
                    </div>
                    {Object.entries(counts).filter(([, count]) => count > 0).map(([type, count]) => {
                        const def = itemDefs[type];
                        const subtotal = count * (def.cost || 0);
                        return (
                            <div key={type} className="grid grid-cols-4 gap-2 items-center border-b border-gray-100 dark:border-slate-700/50 py-1.5">
                                <span className="col-span-1">{count} x {currentLang === 'es' ? def.nameEs : def.nameEn}</span>
                                <input type="number" value={itemCosts[type] ?? def.cost} onChange={(e) => updateItemCost(type, parseInt(e.target.value))} className="w-20 bg-transparent font-mono text-right" />
                                <span className="font-mono text-right">{(def.constructionM2 || 0).toLocaleString('en-US')}</span>
                                <span className="font-mono text-right">${subtotal.toLocaleString('en-US')}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between items-center font-bold pt-2">
                        <span>Subtotal Infraestructura</span>
                        <span className="font-mono">${totalInfraCost.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400">
                        <span>+ Valor Terreno</span>
                        <input type="number" value={landCost} onChange={(e) => setLandCost(parseInt(e.target.value))} className="w-24 bg-transparent font-mono text-right" />
                    </div>
                    <div className="flex justify-between items-center font-black text-base text-gray-800 dark:text-white pt-2 mt-2 border-t-2 border-gray-200 dark:border-slate-600">
                        <span>Total</span>
                        <span className="font-mono">${totalInvestment.toLocaleString('en-US')}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
                        <div className="flex justify-between text-xs">
                            <span>Total m² de Construcción</span>
                            <span>{totalConstructionM2.toLocaleString('en-US')} m²</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-green-600 dark:text-green-400">
                            <span>Área Libre Disponible</span>
                            <span>{availableAreaM2.toLocaleString('en-US')} m²</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">{texts.roiAnnual}</h4>
                    <p className="text-base font-bold text-gray-800 dark:text-white">{roiPercentage}%</p>
                    <input type="range" min="5" max="30" value={roiPercentage} onChange={(e) => setRoiPercentage(parseInt(e.target.value))} className="w-full h-1.5 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h4 className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">{texts.roiRecovery}</h4>
                    <p className="text-base font-bold text-gray-800 dark:text-white">~{recoveryYears.toFixed(1)} años</p>
                </div>
            </div>

            <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">Análisis de Mercado</h4>
                <div className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed text-justify bg-sky-50/50 dark:bg-sky-900/10 p-3 rounded-lg border border-sky-100 dark:border-sky-900/30">
                    <p>Obtén una estimación de la tasa de ocupación y el precio por noche necesarios para alcanzar tu ROI deseado.</p>
                    <button onClick={handleMarketAnalysis} className="mt-3 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-2">
                        <i className="fa-solid fa-chart-line"></i>
                        <span>Analizar Mercado</span>
                    </button>
                    {marketAnalysis && (
                        <div className="mt-4 pt-4 border-t border-sky-200 dark:border-sky-700">
                            <p className="font-bold">Resultados del Análisis:</p>
                            <p>{marketAnalysis}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoiPanel;
