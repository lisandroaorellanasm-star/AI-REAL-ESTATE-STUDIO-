import { lotes } from '@/src/data/lotes';
import { useStore } from '@/src/store';

const Tabs = () => {
    const { activeLotId, setActiveLotId } = useStore();

    return (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm z-10 flex px-4 overflow-x-auto shrink-0 transition-colors">
            {lotes.map(lote => (
                <button 
                    key={lote.id} 
                    onClick={() => setActiveLotId(lote.id)}
                    className={`px-6 py-3 text-sm transition-all focus:outline-none whitespace-nowrap ${activeLotId === lote.id ? 'tab-active' : 'tab-inactive'}`}>
                    {lote.nameKey}
                </button>
            ))}
        </div>
    );
};

export default Tabs; 
