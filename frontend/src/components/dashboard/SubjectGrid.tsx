"use client";

import { useState } from "react";
import SubjectCard from "./SubjectCard";
import { Plus } from "lucide-react";
import AddClassModal from "./AddClassModal";
import { useTranslation } from "react-i18next";

// Initial Dummy Data
const INITIAL_SUBJECTS = [
    { id: "7a-science", grade: "7", section: "A", subject: "Science" },
    { id: "7a-maths", grade: "7", section: "A", subject: "Maths" },
    { id: "8b-english", grade: "8", section: "B", subject: "English" },
    { id: "9c-social", grade: "9", section: "C", subject: "Social Science" },
];

export default function SubjectGrid() {
    const { t } = useTranslation();
    const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddClass = (newClass: { grade: string, section: string, subjects: string[] }) => {
        // Generate new cards for each subject
        const newCards = newClass.subjects.map(sub => ({
            id: `${newClass.grade}${newClass.section}-${sub.toLowerCase()}-${Date.now()}`,
            grade: newClass.grade,
            section: newClass.section,
            subject: sub
        }));
        setSubjects([...subjects, ...newCards]);
    };

    return (
        <div className="space-y-6">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((sub) => (
                    <SubjectCard key={sub.id} {...sub} />
                ))}
            </div>

            {/* Add Button Area */}
            <div className="flex justify-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-primary-dark/30 text-primary-dark font-bold hover:bg-primary-dark/5 hover:border-primary-dark transition-all flex items-center justify-center gap-2"
                >
                    {t('add_class_subject')} <Plus size={24} className="bg-primary-accent text-white rounded-full p-0.5" />
                </button>
            </div>

            <AddClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddClass}
            />
        </div>
    );
}
