"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, X, Loader2, Download, ThumbsUp, ThumbsDown, StopCircle, Globe, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FeedbackService, FeedbackItem } from "@/services/feedback";
import jsPDF from "jspdf";

interface ReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newItem: FeedbackItem) => void;
    initialData?: FeedbackItem | null;
}

const LANGUAGES = [
    { code: "en", name: "English", bcp47: "en-US" },
    { code: "hi", name: "Hindi", bcp47: "hi-IN" },
    { code: "kn", name: "Kannada", bcp47: "kn-IN" },
    { code: "ta", name: "Tamil", bcp47: "ta-IN" },
    { code: "te", name: "Telugu", bcp47: "te-IN" }
];

export default function ReflectionModal({ isOpen, onClose, onSave, initialData }: ReflectionModalProps) {
    const { t } = useTranslation();
    const [isRecording, setIsRecording] = useState(false);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"input" | "processing" | "result">("input");
    const [resultItem, setResultItem] = useState<FeedbackItem | null>(null);
    const [selectedLang, setSelectedLang] = useState("en");

    // Handle initialData or opening logic
    useEffect(() => {
        if (isOpen && initialData) {
            setResultItem(initialData);
            setStep("result");
        } else if (isOpen) {
            // New entry
            setStep("input");
            setInputText("");
            setResultItem(null);
            setIsRecording(false);
        }
    }, [isOpen, initialData]);

    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as any;
        if (webkitSpeechRecognition || SpeechRecognition) {
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;
            const recognition = new SpeechRecognitionConstructor();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setInputText(prev => prev + " " + finalTranscript);
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

    useEffect(() => {
        if (!isOpen) {
            if (step !== "result") {
                setStep("input");
                setInputText("");
                setResultItem(null);
                setIsRecording(false);
                if (recognitionRef.current && isRecording) {
                    recognitionRef.current.stop();
                }
            }
        }
    }, [isOpen]);

    // Audio Refs
    // const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Removed in favor of Speech API
    // const chunksRef = useRef<Blob[]>([]);

    // Listen for "Show Result" event
    useEffect(() => {
        const handleShowResult = (e: CustomEvent<FeedbackItem>) => {
            setResultItem(e.detail);
            setStep("result");
            // If not open, the parent needs to open it. 
            // We assume parent handles isOpen based on this event too or separate logic.
        };

        window.addEventListener('open-feedback-result', handleShowResult as EventListener);
        return () => {
            window.removeEventListener('open-feedback-result', handleShowResult as EventListener);
        };
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            if (recognitionRef.current) {
                const langConfig = LANGUAGES.find(l => l.code === selectedLang);
                recognitionRef.current.lang = langConfig?.bcp47 || 'en-US';
                recognitionRef.current.start();
                setIsRecording(true);
            } else {
                alert("Speech recognition not supported in this browser.");
            }
        }
    };

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setLoading(true);

        try {
            const newItem = await FeedbackService.analyze(inputText, selectedLang);

            // Instant result
            setResultItem(newItem);
            onSave(newItem);
            setStep("result");

        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // removed downloadPDF

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white p-4 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold">Daily Reflection AI</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {step === "processing" ? (
                        // Processing state is now instantaneous (or just generic loading), 
                        // but we keep this simple block just in case we need a transitional state, 
                        // though we plan to skip it. 
                        // Actually, let's just show the input or result. loading is handled by button state.
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={48} /></div>
                    ) : step === "input" ? (
                        <div className="space-y-6">
                            <p className="text-gray-600 text-sm">
                                Speak naturally or type about your class. Select your preferred language for better context.
                            </p>

                            {/* Language Selector */}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-max">
                                <Globe size={18} className="text-gray-500" />
                                <select
                                    className="bg-transparent text-sm font-medium outline-none text-gray-700 cursor-pointer"
                                    value={selectedLang}
                                    onChange={(e) => setSelectedLang(e.target.value)}
                                >
                                    {LANGUAGES.map(l => (
                                        <option key={l.code} value={l.code}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            <textarea
                                className="w-full h-32 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-accent outline-none resize-none text-gray-700 placeholder:text-gray-400"
                                placeholder={isRecording ? "Listening..." : "Type your reflection here or record voice..."}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isRecording}
                            ></textarea>

                            <div className="flex gap-4">
                                <button
                                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all cursor-pointer
                                    ${isRecording
                                            ? "border-red-500 text-red-500 bg-red-50 animate-pulse"
                                            : "border-primary-accent text-primary-accent hover:bg-primary-accent/5"
                                        }`}
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? <><StopCircle size={20} /> Stop</> : <><Mic size={20} /> Record Voice</>}
                                </button>
                                <button
                                    className="flex-1 py-3 bg-[#0e2e72] text-white rounded-xl font-bold hover:opacity-80 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                    onClick={handleAnalyze}
                                    disabled={loading || (!inputText && !isRecording)}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        resultItem && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="space-y-4">
                                    {/* Good Things */}
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ThumbsUp size={18} className="text-green-600" />
                                            <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Good Things</p>
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resultItem.analysis.good_things}</p>
                                    </div>

                                    {/* Bad Things */}
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ThumbsDown size={18} className="text-red-600" />
                                            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Areas of Concern</p>
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resultItem.analysis.bad_things}</p>
                                    </div>

                                    {/* Improvement */}
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle size={18} className="text-blue-600" />
                                            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">How to Improve</p>
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resultItem.analysis.improvement}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2 text-gray-500 font-medium hover:text-gray-700 cursor-pointer"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
