import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';

const MarketingPanel = () => {
    const { currentLang } = useStore();
    const texts = dict[currentLang];

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-[250px]">{texts.marketingDesc}</p>
                <button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-2 px-5 rounded-full text-sm shadow-md transition-transform transform hover:scale-105">
                    {texts.btnGenerateMarketing}
                </button>
            </div>
        </div>
    );
};

export default MarketingPanel;
