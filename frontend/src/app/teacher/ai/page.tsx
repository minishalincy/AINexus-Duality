/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Image as ImageIcon, StopCircle } from 'lucide-react';
import TeacherNavbar from '@/components/TeacherNavbar';

// TypeScript definitions for Web Speech API
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
    "Telugu": "te-IN",
    "Malayalam": "ml-IN",
    "Marathi": "mr-IN",
    "Bengali": "bn-IN",
    "Gujarati": "gu-IN",
    "Punjabi": "pa-IN"
};

type Message = {
    role: 'teacher' | 'ai';
    text: string;
    image?: string;
};

export default function AIWorkspace() {
    const [input, setInput] = useState("");
    const [chat, setChat] = useState<Message[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default for Voice
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    async function send() {
        if (!input && !selectedImage) return;

        const currentInput = input;
        const currentImage = selectedImage;
        const currentPreview = imagePreview;

        // Reset inputs immediately for better UX
        setInput("");
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Add user message to chat
        const newChat: Message[] = [...chat, {
            role: "teacher",
            text: currentInput,
            image: currentPreview || undefined
        }];
        setChat(newChat);
        setIsLoading(true);

        try {
            const form = new FormData();
            if (currentInput) form.append("message", currentInput);
            if (currentImage) form.append("image", currentImage);

            // Extract language code (e.g., 'kn' from 'kn-IN')
            const langCode = LANG_MAP[selectedLanguage]?.split('-')[0] || 'en';
            form.append("language", langCode);

            const res = await fetch("/chat", {
                method: "POST",
                body: form
            });

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setChat([...newChat, { role: "ai", text: data.reply }]);
        } catch (error) {
            console.error(error);
            setChat([...newChat, { role: "ai", text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    function toggleListening() {
        if (isListening) {
            recognitionRef.current?.stop();
            return; // onend will handle state update
        }

        const windowWithSpeech = window as unknown as IWindow;
        const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = LANG_MAP[selectedLanguage];
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const current = e.resultIndex;
            const transcript = e.results[current][0].transcript;
            setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error", e.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <TeacherNavbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24 flex flex-col h-[calc(100vh-64px)]">
                {/* Header Section */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            TeacherAI <span className="text-2xl">🎓</span>
                        </h1>
                        <p className="text-sm text-gray-500">Your AI Teaching Assistant</p>
                    </div>

                    {/* Voice Language Selector */}
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm text-gray-700"
                    >
                        {Object.keys(LANG_MAP).map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {chat.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <p className="text-lg font-medium">How can I help you teach today?</p>
                                <p className="text-sm mt-2 max-w-xs">Ask for lesson plans, teaching tips, or translate content.</p>
                            </div>
                        )}

                        {chat.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === "teacher" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${m.role === "teacher"
                                    ? "bg-primary-600 text-white rounded-br-none"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                                    }`}>
                                    {m.image && (
                                        <div className="mb-2">
                                            <img src={m.image} alt="Uploaded" className="max-h-48 rounded-lg border border-white/20" />
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{m.text}</p>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        {imagePreview && (
                            <div className="mb-2 flex items-center gap-2">
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
                                    <button
                                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">Image selected</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            {/* File Upload Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-full transition-colors"
                                title="Upload Image"
                            >
                                <ImageIcon className="w-5 h-5" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </button>

                            {/* Text Input */}
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && send()}
                                placeholder="Type or speak..."
                                className="flex-1 bg-gray-50 text-gray-900 rounded-full px-5 py-3 border-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none"
                            />

                            {/* Voice Button */}
                            <button
                                onClick={toggleListening}
                                className={`p-3 rounded-full transition-all duration-300 ${isListening
                                    ? "bg-red-50 text-red-600 animate-pulse ring-2 ring-red-200"
                                    : "text-gray-500 hover:text-primary-600 hover:bg-gray-50"
                                    }`}
                                title={isListening ? "Stop Recording" : "Start Voice Input"}
                            >
                                {isListening ? <StopCircle className="w-6 h-6" /> : <Mic className="w-5 h-5" />}
                            </button>

                            {/* Send Button */}
                            <button
                                onClick={send}
                                disabled={!input && !selectedImage}
                                className={`p-3 rounded-full transition-all duration-300 ${(!input && !selectedImage)
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-primary-600 text-white hover:bg-primary-700 shadow-md transform hover:scale-105"
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
