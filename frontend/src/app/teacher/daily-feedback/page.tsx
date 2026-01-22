'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, StopCircle, CheckCircle, AlertCircle, Lightbulb, ArrowRight, ThumbsUp, ThumbsDown, BookOpen, Volume2 } from 'lucide-react';
import TeacherNavbar from '@/components/TeacherNavbar';

// Web Speech API Types
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

interface IWindow extends Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
}

const LANG_MAP: Record<string, string> = {
    "English": "en-IN",
    "Kannada": "kn-IN",
    "Hindi": "hi-IN",
    "Tamil": "ta-IN",
    "Telugu": "te-IN"
};

type FeedbackState = 'idle' | 'recording' | 'processing' | 'ready' | 'viewing' | 'speaking';

interface ReflectionResponse {
    acknowledgement: string;
    deep_dive: string;
    quick_fix: string;
    tomorrow_prep: string;
    pro_tip: string;
}

export default function DailyFeedback() {
    const [state, setState] = useState<FeedbackState>('idle');
    const [input, setInput] = useState("");
    const [response, setResponse] = useState<ReflectionResponse | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [showFullResponse, setShowFullResponse] = useState(false);

    const processReflection = async () => {
        if (!input) return;
        setState('processing');

        try {
            const form = new FormData();
            form.append("message", input);
            form.append("mode", "reflection");
            // Extract language code
            const langCode = LANG_MAP[selectedLanguage]?.split('-')[0] || 'en';
            form.append("language", langCode);

            const res = await fetch("/chat", {
                method: "POST",
                body: form
            });

            if (!res.ok) throw new Error("Failed");
            const data = await res.json();

            // Allow time for "Delayed" simulation effect if needed, but for now instant
            setTimeout(() => {
                setResponse(data.reply);
                setState('ready');
            }, 2000);

        } catch (e) {
            console.error(e);
            setState('idle');
            alert("Error processing reflection. Please try again.");
        }
    };

    const startListening = () => {
        const windowWithSpeech = window as unknown as IWindow;
        const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice recognition not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = LANG_MAP[selectedLanguage];
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onstart = () => setState('recording');
        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const text = e.results[0][0].transcript;
            setInput(prev => prev ? `${prev} ${text}` : text);
        };
        recognition.onend = () => setState('idle');
        recognition.start();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TeacherNavbar />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 pt-24 text-center">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Reflection</h1>
                    <p className="text-gray-500">Share your day in 1 minute to get personalized advice.</p>
                </div>

                {/* State 1: Input (Idle or Recording) */}
                {(state === 'idle' || state === 'recording') && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">How was your day?</h2>
                            <div className="flex gap-2 justify-center mb-4">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Class 5A</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Math</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Inputs */}
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Start typing or tap the mic..."
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none h-32 text-gray-900"
                            />

                            <div className="flex items-center justify-between">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="text-sm border-gray-200 rounded-lg p-2"
                                >
                                    {Object.keys(LANG_MAP).map(l => <option key={l} value={l}>{l}</option>)}
                                </select>

                                <div className="flex gap-3">
                                    <button
                                        onClick={startListening}
                                        className={`p-4 rounded-full transition-all ${state === 'recording'
                                            ? 'bg-red-50 text-red-600 animate-pulse ring-2 ring-red-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {state === 'recording' ? <StopCircle /> : <Mic />}
                                    </button>

                                    <button
                                        onClick={processReflection}
                                        disabled={!input}
                                        className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${input
                                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Share Update <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* State 2: Processing */}
                {state === 'processing' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center"
                    >
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-xl font-medium text-gray-900">AI is analyzing your day...</h3>
                        <p className="text-gray-500 mt-2">Extracting insights & preparing tips</p>
                    </motion.div>
                )}

                {/* State 3: Ready Notification */}
                {state === 'ready' && !showFullResponse && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-linear-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-8 max-w-md mx-auto"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advice Ready!</h2>
                        <p className="text-gray-600 mb-6">We have analyzed your reflection and have some personalized tips for you.</p>

                        <button
                            onClick={() => setShowFullResponse(true)}
                            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-md hover:bg-primary-700 transition-colors"
                        >
                            View Analysis
                        </button>
                    </motion.div>
                )}

                {/* State 4: Full Response View */}
                {showFullResponse && response && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-left max-w-3xl mx-auto space-y-6 pb-20"
                    >
                        {/* TTS Control */}
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => {
                                    if (state === 'speaking') {
                                        window.speechSynthesis.cancel();
                                        setState('ready'); // or 'viewing', but we used 'ready' + 'showFullResponse'
                                    } else {
                                        const text = `${response.acknowledgement}. ${response.deep_dive}. ${response.quick_fix}. ${response.tomorrow_prep}. Pro tip: ${response.pro_tip}`;
                                        const utterance = new SpeechSynthesisUtterance(text);
                                        // Try to match language if possible, else default
                                        // utterance.lang = 'en-IN'; // or dynamic based on `selectedLanguage`
                                        utterance.onend = () => setState('ready');
                                        setState('speaking');
                                        window.speechSynthesis.speak(utterance);
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                            >
                                {state === 'speaking' ? (
                                    <>
                                        <StopCircle className="w-4 h-4" /> Stop Reading
                                    </>
                                ) : (
                                    <>
                                        <Volume2 className="w-4 h-4" /> Listen to Advice
                                    </>
                                )}
                            </button>
                        </div>

                        {/* 1. Acknowledgement */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-start gap-4">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-800 text-lg mb-1">Great Job!</h3>
                                <p className="text-green-700">{response.acknowledgement}</p>
                            </div>
                        </div>

                        {/* 2. Deep Dive */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <h3 className="font-bold text-gray-900 text-lg">Solution Focus</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{response.deep_dive}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* 3. Quick Fix */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                    <h3 className="font-bold text-gray-900">Quick Fix</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{response.quick_fix}</p>
                            </div>

                            {/* 4. Tomorrow Prep */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <ArrowRight className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-bold text-gray-900">For Tomorrow</h3>
                                </div>
                                <p className="text-gray-600 text-sm">{response.tomorrow_prep}</p>
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center gap-4">
                            <Lightbulb className="w-6 h-6 text-indigo-600 shrink-0" />
                            <div>
                                <span className="font-bold text-indigo-900 text-sm uppercase tracking-wide">Pro Tip</span>
                                <p className="text-indigo-800 font-medium italic">&quot;{response.pro_tip}&quot;</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-gray-100">
                            <button className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 font-medium">
                                <ThumbsUp className="w-4 h-4" /> Got it, will try
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 font-medium">
                                <ThumbsDown className="w-4 h-4" /> Not helpful
                            </button>
                        </div>
                    </motion.div>
                )}

            </main>
        </div>
    );
}
