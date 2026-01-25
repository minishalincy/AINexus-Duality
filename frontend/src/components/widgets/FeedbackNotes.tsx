"use client";

import { useState, useEffect } from "react";
import { Mic, FileText } from "lucide-react";
import ReflectionModal from "./ReflectionModal";
import { useTranslation } from "react-i18next";
import { FeedbackService, FeedbackItem } from "@/services/feedback";

export default function FeedbackNotes() {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [notes, setNotes] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [resultData, setResultData] = useState<FeedbackItem | null>(null);

    // Fetch Notes
    useEffect(() => {
        loadNotes();

        // Listener to open modal with result
        const handleOpenResult = (e: CustomEvent<FeedbackItem>) => {
            console.log("Opening result modal for:", e.detail.id);
            setResultData(e.detail);
            setModalOpen(true);
        };

        window.addEventListener('open-feedback-result', handleOpenResult as EventListener);
        return () => window.removeEventListener('open-feedback-result', handleOpenResult as EventListener);
    }, []);

    const loadNotes = async () => {
        try {
            const data = await FeedbackService.getList();
            setNotes(data);
        } catch (error) {
            console.error("Failed to load feedback", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = (newItem: FeedbackItem) => {
        // Prepend new item
        setNotes([newItem, ...notes]);
    };

    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary-dark">{t('classroom_feedback_title')}</h3>
                <span className="text-xs bg-white/60 px-2 py-1 rounded-full text-secondary-dark font-medium border border-white">{t('recent_badge')}</span>
            </div>

            <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[300px] custom-scrollbar">
                {loading ? (
                    <div className="text-center text-gray-400 text-sm py-4">Loading feedback...</div>
                ) : notes.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-4">No feedback yet. Record your first note!</div>
                ) : (
                    notes.slice(0, 5).map(note => ( // Show top 5
                        <div key={note.id} onClick={() => { setResultData(note); setModalOpen(true); }} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary-accent transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                ${note.type === 'Critical' ? 'bg-red-50 text-red-600' :
                                    note.type === 'Success' ? 'bg-green-50 text-green-600' :
                                        'bg-blue-50 text-blue-600'}`}>
                                <FileText size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{note.preview}</p>
                                <p className="text-xs text-gray-500">{note.date} • {note.type}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={() => { setResultData(null); setModalOpen(true); }}
                className="w-full py-3 bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
                {t('add_voice_note')} <Mic size={18} />
            </button>

            <ReflectionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveNote}
                initialData={resultData}
            />
        </div>
    );
}
