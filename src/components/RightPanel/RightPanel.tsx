import { useState } from 'react';
import { ViewType } from '@/src/types';
import { useStore } from '@/src/store';
import { useIdeas } from '@/src/hooks/useIdeas';
import ThreeScene from '../ThreeScene/ThreeScene';
import RoiPanel from '../RoiPanel/RoiPanel';
import MarketingPanel from '../MarketingPanel/MarketingPanel';
import ChatAgent from '../ChatAgent/ChatAgent';
import RenderPanel from '../RenderPanel/RenderPanel';
import OccupancyPanel from '../OccupancyPanel/OccupancyPanel';
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
        <div className="w-full bg-slate-950/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col h-full overflow-hidden transition-all">
            {isLoading ? (
                <div id="ai-status-panel" className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-800/50">
                    <div id="ai-loading">
                        <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400">Analizando terreno...</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Creando proyecciones y distribuyendo planta arquitectónica.</p>
                    </div>
                </div>
            ) : (
                <div id="ai-results-panel" className="flex flex-1 flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10 bg-white/5 shrink-0 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                            <i className="fa-solid fa-brain text-purple-400"></i>
                            Bases del Proyecto (Selección IA)
                        </h3>
                        <OccupancyPanel />
                    </div>

                    <div className="p-4 border-b border-white/10 bg-white/5 shrink-0">
                        <div id="ideas-grid" className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {ideas.map(idea => (
                                <button
                                    key={idea.id}
                                    onClick={() => selectIdea(idea)}
                                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 focus:outline-none idea-card bg-white/5 hover:bg-purple-600/10 ${selectedIdea?.id === idea.id ? 'border-purple-600 bg-purple-600/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-white/5'}`}
                                >
                                    <div className="flex items-center gap-2 font-black text-white text-[10px] uppercase tracking-tight">{idea.title}</div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {idea.elements.slice(0, 3).map(e => (
                                            <span key={e} className="bg-white/10 text-white/50 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">{e}</span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                        <div className="w-full sm:w-2/3 p-5 flex flex-col relative border-r border-white/10">
                            <div className="flex justify-between items-center mb-4 z-10 shrink-0 overflow-x-auto pb-1 gap-4">
                                <h4 id="viewer-title" className="font-black text-[10px] uppercase tracking-[0.2em] text-white/40 min-w-[120px]">Monitoreo de Visualización</h4>
                                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                                    <button onClick={() => setActiveView('3d')} id="btn-view-3d" className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === '3d' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>3D</button>
                                    <button onClick={() => setActiveView('render')} id="btn-view-render" className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'render' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>Render</button>
                                    <button onClick={() => setActiveView('roi')} id="btn-view-roi" className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'roi' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>ROI</button>
                                    <button onClick={() => setActiveView('marketing')} id="btn-view-marketing" className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeView === 'marketing' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>Social</button>
                                </div>
                            </div>
                            <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#020617] transition-all">
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
