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
        <div className="p-5 sm:p-8 overflow-y-auto h-full space-y-8 custom-scrollbar bg-slate-950/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-all">
                    <h4 className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        {texts.roiCostLand}
                    </h4>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-white tracking-tighter">$</span>
                        <input
                            type="number"
                            value={landCost}
                            onChange={(e) => setLandCost(parseInt(e.target.value))}
                            className="text-4xl font-black text-white bg-transparent border-none focus:ring-0 p-0 w-full tracking-tighter"
                        />
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-all">
                    <h4 className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                        {texts.roiCostInfra}
                    </h4>
                    <p className="text-4xl font-black text-white tracking-tighter">${totalInfraCost.toLocaleString('en-US')}</p>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <i className="fa-solid fa-file-invoice-dollar text-8xl text-white"></i>
                </div>
                <h4 className="font-black text-xs text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-list-ul text-purple-500"></i>
                    Desglose de Inversión Tecnológica
                </h4>
                <div className="text-[11px] text-white/60 space-y-4">
                    <div className="grid grid-cols-4 gap-4 font-black text-[9px] uppercase tracking-widest text-white/30 mb-2 border-b border-white/5 pb-2">
                        <span className="col-span-1">Componente</span>
                        <span className="text-right">Costo Est.</span>
                        <span className="text-right">Área Const.</span>
                        <span className="text-right">Inversión</span>
                    </div>
                    {Object.entries(counts).filter(([, count]) => count > 0).map(([type, count]) => {
                        const def = itemDefs[type];
                        const subtotal = count * (itemCosts[type] ?? def.cost ?? 0);
                        return (
                            <div key={type} className="grid grid-cols-4 gap-4 items-center border-b border-white/5 py-3 group/row">
                                <span className="col-span-1 font-black text-white/80 group-hover/row:text-white transition-colors">
                                    {count} x {currentLang === 'es' ? def.nameEs : def.nameEn}
                                </span>
                                <input
                                    type="number"
                                    value={itemCosts[type] ?? def.cost}
                                    onChange={(e) => updateItemCost(type, parseInt(e.target.value))}
                                    className="bg-black/40 border border-white/5 rounded-lg px-2 py-1 font-mono text-right text-purple-400 focus:border-purple-500 transition-all outline-none"
                                />
                                <span className="font-mono text-right text-white/40">{(def.constructionM2 || 0).toLocaleString('en-US')} m²</span>
                                <span className="font-mono text-right text-white font-black">${subtotal.toLocaleString('en-US')}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between items-center font-black text-sm pt-4 border-t border-purple-500/30 text-white">
                        <span className="uppercase tracking-widest">Inversión Final Sugerida</span>
                        <span className="font-mono text-xl tracking-tighter text-purple-400">${totalInvestment.toLocaleString('en-US')}</span>
                    </div>

                    <div className="mt-6 p-4 bg-purple-600/10 rounded-2xl border border-purple-500/20 flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-wider text-white/40">
                            <span>Huella de Construcción</span>
                            <span className="text-white">{totalConstructionM2.toLocaleString('en-US')} m²</span>
                        </div>
                        <div className="flex justify-between text-[10px] uppercase font-black tracking-wider text-emerald-400">
                            <span>Preservación Natural (Área Libre)</span>
                            <span>{availableAreaM2.toLocaleString('en-US')} m²</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-xl">
                    <h4 className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-3">{texts.roiAnnual}</h4>
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-2xl font-black text-white tracking-widest">{roiPercentage}%</p>
                        <span className="text-[10px] text-emerald-400 font-black uppercase">Favorable</span>
                    </div>
                    <input type="range" min="5" max="30" value={roiPercentage} onChange={(e) => setRoiPercentage(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-between">
                    <h4 className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-3">{texts.roiRecovery}</h4>
                    <div>
                        <p className="text-2xl font-black text-white tracking-widest">~{recoveryYears.toFixed(1)} <span className="text-xs text-white/40">AÑOS</span></p>
                        <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                            <div className="bg-purple-600 h-full" style={{ width: `${(10 / recoveryYears) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                        <i className="fa-solid fa-chart-line text-purple-400 text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Análisis de Mercado IA</h4>
                        <p className="text-[10px] text-white/40 font-medium italic">Simulación de ocupación y proyecciones financieras</p>
                    </div>
                </div>

                <div className="text-[11px] text-white/70 leading-relaxed text-justify bg-black/20 p-5 rounded-2xl border border-white/5 min-h-[100px]">
                    {!marketAnalysis ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <p className="text-center opacity-60">Calcula la factibilidad de tu proyecto basándote en la infraestructura seleccionada y el mercado local.</p>
                            <button onClick={handleMarketAnalysis} className="bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] border border-white/10">
                                <i className="fa-solid fa-robot"></i>
                                <span>Ejecutar Proyección</span>
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                <span className="font-black text-purple-400 uppercase tracking-widest text-[9px]">Resultados de Inteligencia</span>
                                <button onClick={() => setMarketAnalysis('')} className="text-white/20 hover:text-white transition-colors text-xs"><i className="fa-solid fa-rotate-left"></i></button>
                            </div>
                            <p className="whitespace-pre-line text-white/80 font-medium leading-relaxed">{marketAnalysis}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RoiPanel;
