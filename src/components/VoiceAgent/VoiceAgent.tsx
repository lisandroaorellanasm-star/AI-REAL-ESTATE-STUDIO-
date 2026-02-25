import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/src/store';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const VoiceAgent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [session, setSession] = useState<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    // Refs for audio playback
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingRef = useRef<boolean>(false);
    const audioContextPlaybackRef = useRef<AudioContext | null>(null);

    const handleToggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = async () => {
        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing. Voice features will not work.");
            alert("Por favor, configura tu API Key en AI Studio (panel Secrets) o en el archivo .env local.");
            return;
        }
        const ai = new GoogleGenAI({ apiKey });
        const liveSession = await ai.live.connect({
            model: 'gemini-1.5-flash',
            callbacks: {
                onmessage: (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (base64Audio) {
                        audioQueueRef.current.push(base64Audio);
                        if (!isPlayingRef.current) {
                            playNextInQueue();
                        }
                    }
                    if (message.serverContent?.inputTranscription) {
                        setTranscription(message.serverContent.inputTranscription.text);
                    }
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                inputAudioTranscription: {},
            },
        });
        setSession(liveSession);
        setIsRecording(true);
        audioContextPlaybackRef.current = new AudioContext({ sampleRate: 16000 });

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        audioSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

        processorRef.current.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0); // Float32Array
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
            }
            let binary = '';
            for (let i = 0; i < pcmData.length; i++) {
                binary += String.fromCharCode(pcmData[i] & 0xFF, (pcmData[i] >> 8) & 0xFF);
            }
            const base64Data = btoa(binary);
            if (liveSession) {
                liveSession.sendRealtimeInput({ media: { data: base64Data, mimeType: `audio/pcm;rate=${audioContextRef.current?.sampleRate}` } });
            }
        };

        audioSourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
    };

    const stopRecording = () => {
        if (session) {
            session.close();
            setSession(null);
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (audioSourceRef.current) {
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        audioQueueRef.current = [];
        isPlayingRef.current = false;
        if (audioContextPlaybackRef.current) {
            audioContextPlaybackRef.current.close();
            audioContextPlaybackRef.current = null;
        }
        setIsRecording(false);
    };

    const playNextInQueue = () => {
        if (audioQueueRef.current.length === 0 || !isPlayingRef.current) {
            isPlayingRef.current = false;
            return;
        }

        isPlayingRef.current = true;
        const base64Audio = audioQueueRef.current.shift();

        if (!base64Audio || !audioContextPlaybackRef.current) {
            playNextInQueue();
            return;
        }

        const audioData = atob(base64Audio);
        const pcmData = new Int16Array(audioData.length / 2);
        for (let i = 0; i < audioData.length; i += 2) {
            pcmData[i / 2] = (audioData.charCodeAt(i + 1) << 8) | audioData.charCodeAt(i);
        }

        const float32Data = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            float32Data[i] = pcmData[i] / 32768.0;
        }

        const audioBuffer = audioContextPlaybackRef.current.createBuffer(
            1,
            float32Data.length,
            16000
        );

        audioBuffer.copyToChannel(float32Data, 0);

        const source = audioContextPlaybackRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextPlaybackRef.current.destination);
        source.onended = playNextInQueue;
        source.start();
    };

    return (
        <div className="fixed bottom-4 right-4">
            <button onClick={handleToggleRecording} className={`w-16 h-16 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}>
                <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
            {transcription && <p>{transcription}</p>}
        </div>
    );
};

export default VoiceAgent;
