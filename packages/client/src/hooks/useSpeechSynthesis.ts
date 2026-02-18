import { useEffect, useRef, useState } from 'react';

type SpeakOptions = {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
};

export function useSpeechSynthesis() {
    const [supported, setSupported] = useState<boolean>(false);
    const [speaking, setSpeaking] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const synth =
            typeof window !== 'undefined' ? window.speechSynthesis : null;
        if (!synth) {
            setSupported(false);
            return;
        }

        setSupported(true);

        const updateVoices = () => {
            setVoices(synth.getVoices() || []);
        };

        updateVoices();
        synth.addEventListener('voiceschanged', updateVoices);

        return () => {
            synth.removeEventListener('voiceschanged', updateVoices);
            synth.cancel();
        };
    }, []);

    const speak = (text: string, options?: SpeakOptions) => {
        if (!supported) return;

        const synth = window.speechSynthesis;
        if (synth.speaking) {
            synth.cancel();
        }

        const u = new SpeechSynthesisUtterance(text);
        if (options?.voice) {
            const match = voices.find(
                (v) => v.name === options.voice || v.voiceURI === options.voice
            );
            if (match) u.voice = match;
        }
        if (options?.rate) u.rate = options.rate;
        if (options?.pitch) u.pitch = options.pitch;
        if (options?.volume) u.volume = options.volume;

        u.onstart = () => {
            utteranceRef.current = u;
            setSpeaking(true);
            setPaused(false);
        };

        u.onend = () => {
            utteranceRef.current = null;
            setSpeaking(false);
            setPaused(false);
        };

        u.onerror = () => {
            utteranceRef.current = null;
            setSpeaking(false);
            setPaused(false);
        };

        synth.speak(u);
    };

    const cancel = () => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        setSpeaking(false);
        setPaused(false);
    };

    const pause = () => {
        if (!supported) return;
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setPaused(true);
            setSpeaking(true);
        }
    };

    const resume = () => {
        if (!supported) return;
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setPaused(false);
            setSpeaking(true);
        }
    };

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return {
        supported,
        speaking,
        paused,
        voices,
        speak,
        cancel,
        pause,
        resume,
    };
}
