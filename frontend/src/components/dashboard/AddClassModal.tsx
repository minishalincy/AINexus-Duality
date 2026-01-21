"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { grade: string; section: string; subjects: string[] }) => void;
}

const AVAILABLE_SUBJECTS = [
    "Maths", "Science", "Social Science", "English", "Kannada", "Hindi"
];

export default function AddClassModal({ isOpen, onClose, onAdd }: AddClassModalProps) {
    const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (grade && section && selectedSubjects.length > 0) {
            onAdd({ grade, section, subjects: selectedSubjects });
            // Reset
            setGrade("");
            setSection("");
            setSelectedSubjects([]);
            onClose();
        }
    };

    const toggleSubject = (sub: string) => {
        if (selectedSubjects.includes(sub)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
        } else {
            setSelectedSubjects([...selectedSubjects, sub]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-primary-dark mb-6">Add Class & Subject</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class (1-10)</label>
                            <select
                                required
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent outline-none bg-white text-gray-900"
                            >
                                <option value="">Select</option>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n.toString()}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                            <input
                                type="text"
                                required
                                value={section}
                                onChange={(e) => setSection(e.target.value.toUpperCase())}
                                maxLength={1}
                                placeholder="A"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</label>
                        <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_SUBJECTS.map(sub => (
                                <label key={sub} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-soft-bg transition-colors">
                                    <input
                                        type="checkbox"
                                        value={sub}
                                        checked={selectedSubjects.includes(sub)}
                                        onChange={() => toggleSubject(sub)}
                                        className="w-4 h-4 text-primary-accent rounded focus:ring-primary-accent"
                                    />
                                    <span className="text-sm text-gray-700">{sub}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-dark text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors mt-4 shadow-lg"
                    >
                        Save Class
                    </button>
                </form>
            </div>
        </div>
    );
}
