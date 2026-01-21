"use client";

import { useState } from "react";
import { Mic, X, Loader2 } from "lucide-react";

interface ReflectionResponse {
    acknowledgement: string;
    deep_dive: string;
    quick_fix: string;
    tomorrow_prep: string;
    pro_tip: string;
}

interface ReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: { text: string; data: ReflectionResponse }) => void;
}

export default function ReflectionModal({ isOpen, onClose, onSave }: ReflectionModalProps) {
    const [isRecording, setIsRecording] = useState(false); // Mock
    const [reflectionText, setReflectionText] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"input" | "result">("input");
    const [result, setResult] = useState<ReflectionResponse | null>(null);

    if (!isOpen) return null;

    const handleAnalyze = async () => {
        if (!reflectionText) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("message", reflectionText);
            formData.append("mode", "reflection");

            const res = await fetch("http://127.0.0.1:8000/api/ai/chat", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.reply && typeof data.reply === 'object') {
                setResult(data.reply);
                setStep("result");
            } else {
                // Fallback
                console.error("Unexpected format", data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (result) {
            onSave({ text: reflectionText, data: result });
            onClose();
            // Reset state
            setStep("input");
            setReflectionText("");
            setResult(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-secondary-dark text-white p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Daily Reflection AI</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <div className="p-6">
                    {step === "input" ? (
                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm">Speak or type about today's class. E.g., "Students were noisy during Science."</p>

                            <textarea
                                className="w-full h-32 p-3 border rounded-xl focus:ring-2 focus:ring-primary-accent outline-none resize-none"
                                placeholder="Type your reflection here..."
                                value={reflectionText}
                                onChange={(e) => setReflectionText(e.target.value)}
                            ></textarea>

                            <div className="flex gap-3">
                                <button
                                    className={`flex-1 py-3 rounded-xl border-2 border-primary-dark/10 flex items-center justify-center gap-2 font-medium hover:bg-primary-dark/5 transition-colors ${isRecording ? "text-red-500 animate-pulse border-red-200" : "text-primary-dark"}`}
                                    onClick={() => {
                                        setIsRecording(!isRecording);
                                        if (!isRecording) {
                                            setTimeout(() => {
                                                setReflectionText("Today during the science experiment, students were very excited but it got chaotic. I couldn't control the noise.");
                                                setIsRecording(false);
                                            }, 2000);
                                        }
                                    }}
                                >
                                    <Mic size={20} /> {isRecording ? "Listening..." : "Record Voice"}
                                </button>
                                <button
                                    className="flex-1 py-3 bg-primary-dark text-white rounded-xl font-bold hover:bg-secondary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                    onClick={handleAnalyze}
                                    disabled={loading || !reflectionText}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-soft-bg/50 p-4 rounded-xl border border-blue-100 space-y-3 max-h-[60vh] overflow-y-auto">
                                {result && (
                                    <>
                                        <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Acknowledgement</p>
                                            <p className="text-gray-800">{result.acknowledgement}</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-primary-accent">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Deep Dive</p>
                                            <p className="text-gray-800">{result.deep_dive}</p>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-400">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Quick Fix</p>
                                            <p className="text-gray-800">{result.quick_fix}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                className="w-full py-3 bg-primary-dark text-white rounded-xl font-bold hover:bg-secondary-dark transition-colors"
                                onClick={handleSave}
                            >
                                Save to Notes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
