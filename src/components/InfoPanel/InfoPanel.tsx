import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';

const InfoPanel = () => {
    const { activeLotId, getActiveLot, currentLang } = useStore();
    const activeLot = getActiveLot();
    const texts = dict[currentLang];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 flex flex-col gap-3 shrink-0 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h2 id="info-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeLot.nameKey}</h2>
                    <p id="info-area" className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">Área: {(activeLot.areaM2 * 1.431).toLocaleString('en-US', { minimumFractionDigits: 2 })} v²</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2 text-xs">
                    {texts.btnRegenerate}
                </button>
            </div>
            <p id="info-desc" className="text-[11px] text-gray-600 dark:text-gray-400 border-l-2 border-purple-300 dark:border-purple-500 pl-2 leading-tight">{texts[activeLot.descKey as keyof typeof texts]}</p>
        </div>
    );
};

export default InfoPanel;
