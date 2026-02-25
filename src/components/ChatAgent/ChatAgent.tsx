import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/src/store';
import { dict } from '@/src/data/i18n';
import { startChat, generateExpertSummary } from '@/src/services/geminiService';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatAgent = ({ totalInvestment, roiPercentage }) => {
    const { selectedIdea, currentLang, getActiveLot, activeMarkers } = useStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isNarrationPlayed, setIsNarrationPlayed] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = (text: string) => {
        if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            setIsSpeaking(false);
            return;
        }

        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            setIsSpeaking(true);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(currentLang));
        if (voice) {
            utterance.voice = voice;
        }
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
    };
    const texts = dict[currentLang];
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleNarrate = async () => {
        if (!selectedIdea) return;
        const summary = `Project: ${selectedIdea.title}. Summary: ${selectedIdea.summary}. Total Investment: $${totalInvestment.toLocaleString('en-US')}. ROI: ${roiPercentage}%.`;
        const text = await generateExpertSummary(summary, currentLang);
        setMessages([{ role: 'model', text: text }]);
        handleSpeak(text);
        setIsNarrationPlayed(true);
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedIdea) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const context = {
            lote: getActiveLot(),
            idea: selectedIdea,
            markers: activeMarkers,
        };

        const response = await startChat(context, [...messages, userMessage], input, currentLang);
        if (response) {
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full sm:w-1/3 p-6 bg-slate-950/20 backdrop-blur-3xl border-l border-white/10 flex flex-col h-full transition-all">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_#a855f7]"></div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/60">{texts.voiceAgent}</h4>
                </div>
                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">IA Expert</div>
            </div>
            {!isNarrationPlayed ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 py-8">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-xl mb-4">
                        <p className="text-[11px] text-white/50 italic leading-relaxed px-4">{texts.voiceHint}</p>
                    </div>
                    <button onClick={handleNarrate} disabled={!selectedIdea} className="w-24 h-24 rounded-full bg-purple-600/10 text-purple-400 flex items-center justify-center text-4xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 relative group border border-purple-500/30">
                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full group-hover:bg-purple-500/40 transition-all"></div>
                        <i className="fa-solid fa-play relative z-10 ml-1"></i>
                    </button>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mt-4 animate-pulse">{texts.voiceWaiting}</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 flex flex-col bg-black/40 rounded-[2rem] p-4 overflow-y-auto mb-6 custom-scrollbar border border-white/5">
                        {messages.map((msg, index) => (
                            <div key={index} className={`max-w-[85%] p-4 rounded-3xl my-2 flex flex-col gap-2 relative group-msg ${msg.role === 'user' ? 'bg-purple-600 text-white self-end rounded-br-none shadow-lg' : 'bg-white/10 text-white/80 self-start rounded-bl-none border border-white/5'}`}>
                                <p className="text-[11px] font-medium leading-relaxed">{msg.text}</p>
                                <button onClick={() => handleSpeak(msg.text)} className={`absolute -bottom-1 ${msg.role === 'user' ? '-left-8' : '-right-8'} p-2 text-white/20 hover:text-purple-400 transition-colors`}>
                                    <i className={`fa-solid ${isSpeaking ? 'fa-pause' : 'fa-volume-high'} text-[10px]`}></i>
                                </button>
                            </div>
                        ))}
                        {isLoading && <div className="self-start p-4 bg-white/5 rounded-2xl animate-pulse"><p className="text-white/20 text-xs">...</p></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Consultar experto..." className="flex-1 bg-transparent px-3 py-2 text-white text-[11px] placeholder:text-white/20 focus:outline-none font-medium" />
                        <button onClick={handleSend} disabled={isLoading} className="w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center border border-white/10">
                            <i className="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatAgent;
