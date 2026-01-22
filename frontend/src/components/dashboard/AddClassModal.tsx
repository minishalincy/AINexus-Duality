
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { grade: string; section: string; subjects: string[] }) => void;
}

// Predefined dataset mapping grades to subjects
const GRADE_SUBJECTS: Record<string, string[]> = {
    "1": ["Maths", "English", "EVS", "Kannada", "Hindi"],
    "2": ["Maths", "English", "EVS", "Kannada", "Hindi"],
    "3": ["Maths", "English", "EVS", "Kannada", "Hindi"],
    "4": ["Maths", "English", "EVS", "Kannada", "Hindi"],
    "5": ["Maths", "English", "EVS", "Kannada", "Hindi"],
    "6": ["Maths", "Science", "Social Science", "English", "Kannada", "Hindi"],
    "7": ["Maths", "Science", "Social Science", "English", "Kannada", "Hindi"],
    "8": ["Maths", "Science", "Social Science", "English", "Kannada", "Hindi"],
    "9": ["Maths", "Science", "Social Science", "English", "Kannada", "Hindi"],
    "10": ["Maths", "Science", "Social Science", "English", "Kannada", "Hindi"],
};

export default function AddClassModal({ isOpen, onClose, onAdd }: AddClassModalProps) {
    const { t } = useTranslation();
    const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    
    // Derived state
    const availableSubjects = grade && GRADE_SUBJECTS[grade] ? GRADE_SUBJECTS[grade] : [];

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            // Only reset if fields are not already empty to avoid unnecessary renders/warnings
            if (grade || section || selectedSubjects.length > 0) {
                // eslint-disable-next-line
                setGrade("");
                setSection("");
                setSelectedSubjects([]);
            }
        }
    }, [isOpen, grade, section, selectedSubjects]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (grade && section && selectedSubjects.length > 0) {
            onAdd({ grade, section, subjects: selectedSubjects });
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

                <h2 className="text-2xl font-bold text-primary-dark mb-6">{t('add_class_modal_title') || "Add New Class"}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('class_label') || "Class"}</label>
                            <select
                                required
                                value={grade}
                                onChange={(e) => {
                                    setGrade(e.target.value);
                                    setSelectedSubjects([]);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-accent outline-none bg-white text-gray-900"
                            >
                                <option value="">Select</option>
                                {Object.keys(GRADE_SUBJECTS).sort((a,b) => Number(a)-Number(b)).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('section_label') || "Section"}</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('select_subjects_label') || "Select Subjects"}</label>
                        {grade ? (
                            <div className="grid grid-cols-2 gap-2">
                                {availableSubjects.map(sub => (
                                    <label key={sub} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${selectedSubjects.includes(sub) ? 'bg-primary-50 border-primary-accent' : 'hover:bg-gray-50 border-gray-200'}`}>
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
                        ) : (
                            <p className="text-sm text-gray-500 italic">Please select a class first to see subjects.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!grade || !section || selectedSubjects.length === 0}
                        className="w-full py-3 bg-primary-dark text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Class
                    </button>
                </form>
            </div>
        </div>
    );
}
