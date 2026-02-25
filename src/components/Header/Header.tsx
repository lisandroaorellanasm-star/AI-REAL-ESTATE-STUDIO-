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
        <header className="bg-slate-900 dark:bg-slate-900 text-white px-4 md:px-6 py-3 shadow-md flex justify-between items-center z-20 shrink-0 border-b dark:border-slate-800">
            <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg shadow-lg">
                    {/* Placeholder for an icon */}
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight">{texts.appTitle}</h1>
                    <p className="text-xs text-slate-400 hidden sm:block">{texts.appSubtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <button onClick={toggleLanguage} className="bg-slate-800 text-slate-300 hover:text-white px-2 py-1.5 rounded text-xs font-bold border border-slate-700 transition-colors w-10 text-center">
                    {currentLang === 'es' ? 'EN' : 'ES'}
                </button>
                <button onClick={toggleTheme} className="bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded text-xs border border-slate-700 transition-colors flex items-center justify-center">
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button id="unit-toggle" className="bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded text-xs font-bold border border-slate-700 transition-colors whitespace-nowrap">
                    Ver en m²
                </button>
                <audio ref={audioRef} src="https://www.chosic.com/wp-content/uploads/2021/07/The-Road-Home.mp3" loop />
                <button onClick={toggleMusic} className="bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded text-xs border border-slate-700 transition-colors flex items-center gap-2">
                    <i className={`fa-solid ${isMusicPlaying ? 'fa-volume-high' : 'fa-volume-off'}`}></i> <span className="hidden sm:inline">{isMusicPlaying ? 'Música On' : 'Música Off'}</span>
                </button>
                <input type="range" min="0" max="1" step="0.1" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
        </header>
    );
};

export default Header;
