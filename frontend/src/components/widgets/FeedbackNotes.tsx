"use client";

import { useState } from "react";
import { Mic, FileText } from "lucide-react";
import ReflectionModal from "./ReflectionModal";

const STATIC_NOTES = [
    { id: 1, date: "Oct 24", preview: "Science class was chaotic during lab...", type: "Critical" },
    { id: 2, date: "Oct 23", preview: "Students struggled with Algebra basics.", type: "Observation" },
    { id: 3, date: "Oct 22", preview: "Great engagement during History quiz!", type: "Success" }
];

export default function FeedbackNotes() {
    const [modalOpen, setModalOpen] = useState(false);
    const [notes, setNotes] = useState(STATIC_NOTES);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSaveNote = (noteData: { text: string, data: any }) => {
        setNotes([
            {
                id: Date.now(),
                date: "Today",
                preview: noteData.text.substring(0, 40) + "...",
                type: "AI Insight"
            },
            ...notes
        ]);
    };

    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary-dark">Classroom Feedback</h3>
                <span className="text-xs bg-white/60 px-2 py-1 rounded-full text-secondary-dark font-medium border border-white">Recent</span>
            </div>

            <div className="flex-1 space-y-3 mb-6">
                {notes.slice(0, 3).map(note => (
                    <div key={note.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary-accent transition-colors">
                        <div className="w-10 h-10 rounded-full bg-soft-bg flex items-center justify-center text-primary-dark shrink-0">
                            <FileText size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{note.preview}</p>
                            <p className="text-xs text-gray-500">{note.date} • {note.type}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3 bg-orange-300/20 text-orange-700 font-bold rounded-xl border border-orange-200 hover:bg-orange-300/40 transition-colors flex items-center justify-center gap-2"
            >
                Add Voice Note <Mic size={18} />
            </button>

            <ReflectionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveNote}
            />
        </div>
    );
}
