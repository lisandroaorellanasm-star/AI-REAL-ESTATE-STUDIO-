import { useEffect } from 'react';
import Header from './components/Header/Header';
import Tabs from './components/Tabs/Tabs';
import InfoPanel from './components/InfoPanel/InfoPanel';
import Map from './components/Map/Map';
import RightPanel from './components/RightPanel/RightPanel';
import OccupancyPanel from './components/OccupancyPanel/OccupancyPanel';
import VoiceAgent from './components/VoiceAgent/VoiceAgent';
import InventoryPanel from './components/InventoryPanel/InventoryPanel';
import { useStore } from './store';

export default function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="bg-gray-100 dark:bg-slate-950 h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300">
      <Header />
      <Tabs />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        <div className="w-full lg:w-5/12 flex flex-col gap-4 h-1/2 lg:h-full relative">
          <InfoPanel />
          <div className="flex-1 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden relative">
            <Map />
            <InventoryPanel />
          </div>
        </div>
        <RightPanel />
                <OccupancyPanel />
                <VoiceAgent />
      </main>
    </div>
  );
}
