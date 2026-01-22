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
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
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

        // ASYNC FLOW:
        // 1. Send to backend to start "job" (or just analyze and cache it).
        // 2. Notify user it will take time.
        // 3. Close modal.

        try {
            // We still call analyze to get the promise, but we simulate the "Wait".
            // In reality, we'd trigger a background job. 
            // Here, we'll fetch it, but NOT show it yet.
            const newItem = await FeedbackService.analyze(inputText, selectedLang);

            // Dispatch Start Event (Simulation of 5 min wait)
            const event = new CustomEvent('feedback-analysis-start', { detail: newItem });
            window.dispatchEvent(event);

            onSave(newItem); // Update list optimistically (or maybe showing "Pending" state would be better, but MVP: show it)

            // Show temporary success state then close
            setStep("processing");
            setTimeout(() => {
                onClose();
                setStep("input"); // Reset for next time
            }, 2000);

        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
            setLoading(false);
        }
    };

    const handleRate = async (success: boolean) => {
        if (!resultItem) return;
        try {
            await FeedbackService.rate(resultItem.id, success);
            alert("Thanks for your feedback!");
        } catch (e) {
            console.error(e);
        }
    };

    const downloadPDF = () => {
        if (!resultItem) return;
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("Classroom Feedback Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Date: ${resultItem.date}`, 20, 30);
        doc.text(`Language: ${LANGUAGES.find(l => l.code === resultItem.language)?.name || resultItem.language}`, 20, 40);

        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(14);
        doc.setTextColor(0, 50, 150);
        doc.text("Input:", 20, 55);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitText = doc.splitTextToSize(resultItem.full_text, 170);
        doc.text(splitText, 20, 65);

        let y = 65 + (splitText.length * 7) + 10;

        const sections = [
            { title: "Acknowledgement", content: resultItem.analysis.acknowledgement, color: [0, 100, 0] }, // Dark Green
            { title: "Deep Dive", content: resultItem.analysis.deep_dive, color: [0, 0, 150] }, // Dark Blue
            { title: "Quick Fix", content: resultItem.analysis.quick_fix, color: [200, 100, 0] }, // Orange
            { title: "Pro Tip", content: resultItem.analysis.pro_tip, color: [100, 0, 100] } // Purple
        ];

        sections.forEach(sec => {
            if (y > 250) { doc.addPage(); y = 20; }

            doc.setFontSize(14);
            doc.setTextColor(sec.color[0], sec.color[1], sec.color[2]);
            doc.text(sec.title, 20, y);
            y += 7;

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const content = doc.splitTextToSize(sec.content, 170);
            doc.text(content, 20, y);
            y += (content.length * 7) + 10;
        });

        doc.save(`feedback-report-${resultItem.date}.pdf`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-primary-dark text-white p-4 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold">Daily Reflection AI</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {step === "processing" ? (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Analysis Started</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">
                                The AI is analyzing your reflection. This usually takes about 5 minutes. We will notify you when the report is ready.
                            </p>
                        </div>
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
                                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all
                                    ${isRecording
                                            ? "border-red-500 text-red-500 bg-red-50 animate-pulse"
                                            : "border-primary-accent text-primary-accent hover:bg-primary-accent/5"
                                        }`}
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? <><StopCircle size={20} /> Stop</> : <><Mic size={20} /> Record Voice</>}
                                </button>
                                <button
                                    className="flex-1 py-3 bg-primary-dark text-white rounded-xl font-bold hover:bg-secondary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
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
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Acknowledgement</p>
                                        <p className="text-gray-800 text-sm leading-relaxed">{resultItem.analysis.acknowledgement}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Deep Dive</p>
                                        <p className="text-gray-800 text-sm leading-relaxed">{resultItem.analysis.deep_dive}</p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">Quick Fix</p>
                                        <p className="text-gray-800 text-sm leading-relaxed">{resultItem.analysis.quick_fix}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Did this help?</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleRate(true)} className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"><ThumbsUp size={20} /></button>
                                            <button onClick={() => handleRate(false)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"><ThumbsDown size={20} /></button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={downloadPDF}
                                        className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download size={18} /> Download Report (PDF)
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 text-gray-500 font-medium hover:text-gray-700"
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
