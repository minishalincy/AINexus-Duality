'use client';

import { useState, useRef, useEffect } from "react";
import { Mic, Image as ImageIcon, Send, X, Loader2, ChevronDown, StopCircle } from "lucide-react";
import { languages } from "@/lib/languages";
import { useTranslation } from "react-i18next";

// Web Speech API Types
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export default function AssistAIWidget() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState("en");
    const [isRecording, setIsRecording] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        if (webkitSpeechRecognition || SpeechRecognition) {
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;
            const recognition = new SpeechRecognitionConstructor();
            recognition.continuous = true; // Keep listening until stopped
            recognition.interimResults = true; // Show results while speaking

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        // Optional: Handle interim results if we want real-time preview (append current input)
                        // For simplicity, we mostly care about final, but we can update input continuously
                        setInput(prev => {
                            // This is tricky with state updates. 
                            // Better strategy: just replace input with latest transcript sequence or append?
                            // User wants: "transcribed... shown in input box"
                            // Simplest: Replace input with the full session transcript? 
                            // Or just append. 
                            // Let's just use the final results to append or replace.
                            return finalTranscript;
                        });
                    }
                }
                if (finalTranscript) {
                    setInput(finalTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (recognitionRef.current) {
                // Map lang code to BCP-47 (Approximate for Indian context)
                const langCode = selectedLang === 'en' ? 'en-US' : `${selectedLang}-IN`;
                recognitionRef.current.lang = langCode;
                recognitionRef.current.start();
                setIsRecording(true);
                if (!isOpen) setIsOpen(true); // Open chat if closed
            } else {
                alert("Speech recognition not supported in this browser.");
            }
        }
    };

    const handleSendMessage = async (text: string = input, image?: File) => {
        if (!text && !image) return;
        if (!isOpen) setIsOpen(true);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', text: text || (image ? t('sent_image') : "") }]);
        setInput("");
        setLoading(true);

        try {
            const formData = new FormData();
            if (text) formData.append("message", text);
            if (image) formData.append("image", image);
            formData.append("language", selectedLang); // Send selected language

            const res = await fetch("/api/ai/chat", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            let reply = "";
            if (typeof data.reply === "string") {
                reply = data.reply;
            } else if (typeof data.reply === "object") {
                reply = JSON.stringify(data.reply, null, 2);
            }

            setMessages(prev => [...prev, { role: 'ai', text: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: t('connection_error') }]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleSendMessage("", file);
        }
    };

    return (
        <>
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 w-full mx-auto hover:shadow-lg transition-shadow duration-300">
                {/* Input Bar */}
                <div
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:opacity-90 transition-all mb-4"
                >
                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                        <span className="text-xs">AI</span>
                    </div>
                    <span className="text-lg">{t('message_placeholder')}</span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={toggleRecording}
                        className={`bg-white border-2 hover:border-primary-accent rounded-xl p-6 flex flex-col items-center justify-center gap-2 group transition-all cursor-pointer ${isRecording ? 'border-red-500 animate-pulse' : 'border-gray-100'}`}
                    >
                        <div className={`p-3 rounded-full border transition-transform group-hover:scale-110 ${isRecording ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                            {isRecording ? <StopCircle size={32} className="text-red-500" /> : <Mic size={32} className="text-primary-dark" />}
                        </div>
                        <span className={`text-sm font-medium ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
                            {isRecording ? t('stop_recording') : t('tap_to_speak')}
                        </span>
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border-2 border-gray-100 hover:border-primary-accent rounded-xl p-6 flex flex-col items-center justify-center gap-2 group transition-all cursor-pointer"
                    >
                        <div className="bg-white p-3 rounded-full border border-gray-200 group-hover:scale-110 transition-transform">
                            {/* Colorful Icon */}
                            <div className="relative w-8 h-8">
                                <ImageIcon size={32} className="text-primary-accent" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <span className="text-sm font-medium text-gray-500">{t('upload_photo')}</span>
                    </button>
                </div>
            </div>

            {/* Chat Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">

                        {/* Header */}
                        <div className="bg-primary-dark text-white p-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <span className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">AI</span>
                                {t('ai_assist_title')}
                            </h3>
                            <button onClick={() => { setIsOpen(false); setIsRecording(false); recognitionRef.current?.stop(); }} className="hover:bg-white/10 p-2 rounded-full cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Wave Animation Overlay (When Recording) */}
                        {isRecording && (
                            <div className="absolute inset-x-0 top-16 z-20 bg-primary-50/90 backdrop-blur-sm p-4 flex items-center justify-center gap-2 animate-in slide-in-from-top-4 border-b border-primary-100">
                                <div className="flex items-center gap-1 h-8">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-1 bg-primary-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: '100%' }}></div>
                                    ))}
                                </div>
                                <span className="text-primary-700 font-medium animate-pulse">{t('listening_status')} ({languages.find(l => l.code === selectedLang)?.name})...</span>
                                <button onClick={toggleRecording} className="ml-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 cursor-pointer">
                                    <StopCircle size={20} />
                                </button>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soft-bg/30 pb-24"> {/* Added padding bottom for input area */}
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <p>{t('ai_welcome_msg')}</p>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-primary-accent text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-primary-accent" /> {t('thinking_status')}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            {/* Language Selector & Controls Row */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="relative group">
                                    <select
                                        value={selectedLang}
                                        onChange={(e) => setSelectedLang(e.target.value)}
                                        className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-full pl-4 pr-8 py-2 focus:outline-none focus:border-primary-500 cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="flex-1"></div> {/* Spacer */}

                                <button
                                    onClick={toggleRecording}
                                    className={`p-2 rounded-full transition-colors cursor-pointer ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    title="Voice Input"
                                >
                                    {isRecording ? <div className="animate-pulse"><StopCircle size={20} /></div> : <Mic size={20} />}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={isRecording ? t('listening_status') : t('message_placeholder')}
                                    disabled={isRecording}
                                    className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-accent outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={loading || (!input.trim() && !isRecording)}
                                    className="p-3 bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes wave {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1.5); }
                }
            `}</style>
        </>
    );
}
