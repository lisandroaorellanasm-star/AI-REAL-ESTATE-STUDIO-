import { useState } from 'react';
import { ViewType } from '@/src/types';
import { useStore } from '@/src/store';
import { useIdeas } from '@/src/hooks/useIdeas';
import ThreeScene from '../ThreeScene/ThreeScene';
import RoiPanel from '../RoiPanel/RoiPanel';
import MarketingPanel from '../MarketingPanel/MarketingPanel';
import ChatAgent from '../ChatAgent/ChatAgent';
import RenderPanel from '../RenderPanel/RenderPanel';
import { itemDefs } from '@/src/data/lotes';

const RightPanel = () => {
    const { getActiveLot, activeMarkers, itemCosts, landCost } = useStore();
    const [roiPercentage, setRoiPercentage] = useState(16); // Default to 16%

    const counts: { [key: string]: number } = {};
    activeMarkers.forEach(m => {
        counts[m.type] = (counts[m.type] || 0) + 1;
    });

    const totalInfraCost = Object.entries(counts).reduce((acc, [type, count]) => {
        const cost = (itemCosts[type] ?? itemDefs[type]?.cost) || 0;
        return acc + (count * cost);
    }, 0);

    const totalInvestment = landCost + totalInfraCost;
    const { ideas, isLoading } = useIdeas();
    const [activeView, setActiveView] = useState<ViewType>('3d');
    const { selectIdea, selectedIdea } = useStore();

    return (
        <div className="w-full lg:w-7/12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col h-1/2 lg:h-full overflow-hidden transition-colors">
            {isLoading ? (
                <div id="ai-status-panel" className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-800/50">
                    <div id="ai-loading">
                        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">Analizando terreno...</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Creando proyecciones y distribuyendo planta arquitectónica.</p>
                    </div>
                </div>
            ) : (
                <div id="ai-results-panel" className="flex flex-1 flex-col overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-slate-700 bg-purple-50/50 dark:bg-purple-900/10 shrink-0 transition-colors">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-xs mb-2 flex items-center gap-2 px-1">
                            Bases del Proyecto (Elige una para iniciar)
                        </h3>
                        <div id="ideas-grid" className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {ideas.map(idea => (
                                <button key={idea.id} onClick={() => selectIdea(idea)} className={`text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-1 focus:outline-none idea-card bg-white dark:bg-slate-800 hover:border-purple-300 dark:border-slate-600 ${selectedIdea?.id === idea.id ? 'border-purple-600' : ''}`}>
                                    <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200 text-xs">{idea.title}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {idea.elements.slice(0, 3).map(e => (
                                            <span key={e} className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-[9px] px-1.5 py-0.5 rounded">{e}</span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                        <div className="w-full sm:w-2/3 p-4 flex flex-col relative border-r border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-2 z-10 shrink-0 overflow-x-auto pb-1">
                                <h4 id="viewer-title" className="font-bold text-sm text-gray-700 dark:text-gray-200 min-w-[120px]">Vista Isométrica 3D</h4>
                                <div className="flex gap-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg border border-gray-200 dark:border-slate-600 shrink-0 ml-2">
                                    <button onClick={() => setActiveView('3d')} id="btn-view-3d" className={`px-2 py-1 text-xs font-bold rounded transition ${activeView === '3d' ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>3D</button>
                                    <button onClick={() => setActiveView('render')} id="btn-view-render" className={`px-2 py-1 text-xs font-medium rounded transition ${activeView === 'render' ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>Render</button>
                                    <button onClick={() => setActiveView('roi')} id="btn-view-roi" className={`px-2 py-1 text-xs font-medium rounded transition ${activeView === 'roi' ? 'bg-white dark:bg-slate-800 shadow-sm text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>Inversión</button>
                                    <button onClick={() => setActiveView('marketing')} id="btn-view-marketing" className={`px-2 py-1 text-xs font-medium rounded transition ${activeView === 'marketing' ? 'bg-white dark:bg-slate-800 shadow-sm text-pink-600 dark:text-pink-400' : 'text-gray-500 dark:text-gray-400'}`}>Marketing</button>
                                </div>
                            </div>
                            <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner bg-[#e0f2fe] dark:bg-slate-900 transition-colors">
                                {activeView === '3d' && <ThreeScene />}
                                {activeView === 'roi' && <RoiPanel />}
                                {activeView === 'marketing' && <MarketingPanel />}
                                {activeView === 'render' && <RenderPanel />}
                            </div>
                        </div>
                        <ChatAgent totalInvestment={totalInvestment} roiPercentage={roiPercentage} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightPanel;
