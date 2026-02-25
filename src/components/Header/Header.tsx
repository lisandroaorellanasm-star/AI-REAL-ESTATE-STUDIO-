import React, { useRef, useEffect } from 'react';
import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';

const Header = () => {
    const { currentLang, toggleLanguage, isDarkMode, toggleTheme, isMusicPlaying, toggleMusic, musicVolume, setMusicVolume } = useStore();
    const texts = dict[currentLang];
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = musicVolume;
            if (isMusicPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMusicPlaying, musicVolume]);

    return (
        <header className="bg-slate-950/80 backdrop-blur-2xl text-white px-6 md:px-8 py-4 shadow-2xl flex justify-between items-center z-50 shrink-0 border-b border-white/5 mx-4 mt-4 rounded-[2rem]">
            <div className="flex items-center gap-4">
                <div className="bg-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <i className="fa-solid fa-cube text-white text-xl"></i>
                </div>
                <div>
                    <h1 className="text-base font-black uppercase tracking-tighter leading-tight">{texts.appTitle}</h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#a855f7]"></div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">{texts.appSubtitle}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
                <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 mr-4">
                    <i className={`fa-solid ${isMusicPlaying ? 'fa-volume-high' : 'fa-volume-off'} text-white/40 text-sm`}></i>
                    <input type="range" min="0" max="1" step="0.1" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" title="Volumen" />
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    <button onClick={toggleLanguage} className="hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest transition-all">
                        {currentLang === 'es' ? 'EN' : 'ES'}
                    </button>
                    <button onClick={toggleTheme} className="hover:bg-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-xl text-sm transition-all focus:outline-none">
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                <button id="unit-toggle" className="hidden sm:block bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active:scale-95">
                    Ver en m²
                </button>

                <button
                    onClick={() => {
                        import('../../services/supabaseClient').then(({ supabase }) => supabase.auth.signOut());
                    }}
                    className="bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 p-2.5 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all group"
                    title="Salir"
                >
                    <i className="fa-solid fa-power-off text-sm group-hover:scale-110 transition-transform"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
