import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';

const MarketingPanel = () => {
    const { currentLang } = useStore();
    const texts = dict[currentLang];

    return (
        <div className="p-8 h-full flex items-center justify-center bg-slate-950/20">
            <div className="flex flex-col items-center justify-center text-center max-w-sm">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full"></div>
                    <i className="fa-solid fa-bullhorn text-5xl text-purple-400 relative z-10 animate-pulse"></i>
                </div>
                <h3 className="font-black text-white text-lg uppercase tracking-widest mb-3">Generador de Campañas IA</h3>
                <p className="text-[11px] text-white/40 mb-8 leading-relaxed font-medium italic">{texts.marketingDesc}</p>
                <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 text-xs uppercase tracking-[0.2em] border border-white/10">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    {texts.btnGenerateMarketing}
                </button>
            </div>
        </div>
    );
};

export default MarketingPanel;
