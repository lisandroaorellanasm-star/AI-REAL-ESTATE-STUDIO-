import { useEffect } from 'react';
import Header from './components/Header/Header';
import Tabs from './components/Tabs/Tabs';
import InfoPanel from './components/InfoPanel/InfoPanel';
import Map from './components/Map/Map';
import RightPanel from './components/RightPanel/RightPanel';
import VoiceAgent from './components/VoiceAgent/VoiceAgent';
import InventoryPanel from './components/InventoryPanel/InventoryPanel';
import LandingPage from './components/Landing/LandingPage';
import { useStore } from './store';
import { usePersistence } from './hooks/usePersistence';
import { supabase } from './services/supabaseClient';

export default function App() {
  usePersistence();
  const { isDarkMode, user, setUser } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="bg-[#020617] text-white h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 selection:bg-purple-500/30">
      <Header />
      <Tabs />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 md:p-6 gap-6 scroll-auto lg:overflow-hidden">
        <div className="w-full lg:w-5/12 flex flex-col gap-6 h-[45vh] lg:h-full relative shrink-0 lg:shrink">
          <InfoPanel />
          <InventoryPanel />
          <div className="flex-1 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden relative min-h-[200px] bg-slate-900/50 backdrop-blur-sm">
            <Map />
          </div>
        </div>
        <div className="w-full lg:w-7/12 flex flex-col h-[55vh] lg:h-full min-h-[400px] lg:min-h-0">
          <RightPanel />
        </div>
        <VoiceAgent />
      </main>
    </div>
  );
}
