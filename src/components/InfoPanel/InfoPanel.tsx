import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';

const InfoPanel = () => {
    const { activeLotId, getActiveLot, currentLang } = useStore();
    const activeLot = getActiveLot();
    const texts = dict[currentLang];

    return (
        <div className="bg-slate-950/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-5 flex flex-col gap-3 shrink-0 transition-all hover:bg-slate-900/90 group">
            <div className="flex justify-between items-start">
                <div>
                    <h2 id="info-title" className="text-xl font-black text-white tracking-tight leading-none group-hover:text-purple-400 transition-colors uppercase italic">{activeLot.nameKey}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                        <p id="info-area" className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                            Área: <span className="text-white">{(activeLot.areaM2 * 1.431).toLocaleString('en-US', { minimumFractionDigits: 2 })} v²</span>
                        </p>
                    </div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white font-black py-2 px-4 rounded-2xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-[10px] uppercase tracking-widest border border-white/10">
                    <i className="fa-solid fa-rotate"></i>
                    {texts.btnRegenerate}
                </button>
            </div>
            <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full"></div>
            <p id="info-desc" className="text-[11px] text-white/50 border-l-2 border-purple-500/50 pl-3 leading-relaxed font-medium hidden lg:block italic">
                {texts[activeLot.descKey as keyof typeof texts]}
            </p>
        </div>
    );
};

export default InfoPanel;
