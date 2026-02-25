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
        <div className="w-full sm:w-1/3 p-4 bg-white dark:bg-slate-800 flex flex-col transition-colors">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-slate-700 shrink-0">
                <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{texts.voiceAgent}</h4>
            </div>
            {!isNarrationPlayed ? (
                <div className="flex-1 flex flex-col justify-center items-center text-center gap-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic px-2 leading-relaxed">{texts.voiceHint}</p>
                    <button onClick={handleNarrate} disabled={!selectedIdea} className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 flex items-center justify-center text-3xl shadow transition-all transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative group">
                        ▶
                    </button>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{texts.voiceWaiting}</p>
                </div>
            ) : (
                <>
                    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2 overflow-y-auto mb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-lg my-1 ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/50 self-end' : 'bg-gray-200 dark:bg-slate-700/50 self-start'}`}>
                                <p className="text-xs text-gray-800 dark:text-gray-200">{msg.text}</p>
                                <button onClick={() => handleSpeak(msg.text)} className="ml-2 text-xs text-gray-500 dark:text-gray-400"><i className={`fa-solid ${isSpeaking ? 'fa-pause' : 'fa-volume-high'}`}></i></button>
                            </div>
                        ))}
                        {isLoading && <div className="self-start p-2"><p className="text-xs">...</p></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Escribe tu pregunta..." className="flex-1 p-2 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                        <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold disabled:opacity-50">
                            Enviar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatAgent;
