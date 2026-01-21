"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSyllabus } from "@/data/syllabus";
import { ArrowLeft, CheckCircle, Circle, Trophy } from "lucide-react";

export default function SubjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    // Parse ID: e.g., "7a-science-123456"
    // Needs robust parsing

    const [completedChapters, setCompletedChapters] = useState<number[]>([]);
    const [showCelebration, setShowCelebration] = useState(false);

    // Extract metadata from ID (mock logic matching the ID generation)
    // Format: grade+section-subject-timestamp
    // ex: 7A-science-123
    // robust regex or split
    const parts = id.split('-');
    const gradeSection = parts[0] || "7A";
    const grade = parseInt(gradeSection.match(/\d+/)?.[0] || "7");
    const subject = parts[1] || "Science";
    const displaySubject = subject.charAt(0).toUpperCase() + subject.slice(1);

    const syllabus = getSyllabus(displaySubject, grade);

    const toggleChapter = (index: number) => {
        if (completedChapters.includes(index)) {
            setCompletedChapters(completedChapters.filter(i => i !== index));
            setShowCelebration(false);
        } else {
            const newCompleted = [...completedChapters, index];
            setCompletedChapters(newCompleted);
            if (newCompleted.length === syllabus.length) {
                triggerCelebration();
            }
        }
    };

    const triggerCelebration = () => {
        setShowCelebration(true);
        // CSS-based simple confetti could be added here, or just UI feedback
    };

    const progress = Math.round((completedChapters.length / syllabus.length) * 100);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-sm">
                    <ArrowLeft size={24} className="text-primary-dark" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-primary-dark">Class {gradeSection} - {displaySubject}</h1>
                    <p className="text-gray-500">Track your teaching progress</p>
                </div>
            </div>

            {/* Progress Bar (Train Style) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2 font-bold text-secondary-dark">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-accent to-green-400 transition-all duration-500 ease-out flex items-center justify-end px-2"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Train Icon or Dot */}
                        <div className="w-4 h-4 bg-white rounded-full shadow-md animate-pulse"></div>
                    </div>
                </div>
                {showCelebration && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                        <Trophy size={24} className="text-yellow-600" />
                        <span className="font-bold">Congratulations! Syllabus Completed!</span>
                    </div>
                )}
            </div>

            {/* Syllabus List */}
            <div className="grid gap-4">
                {syllabus.map((chapter, index) => {
                    const isCompleted = completedChapters.includes(index);
                    return (
                        <div
                            key={index}
                            onClick={() => toggleChapter(index)}
                            className={`bg-white p-5 rounded-2xl shadow-sm border-2 cursor-pointer transition-all flex items-center gap-4 group ${isCompleted ? "border-green-500 bg-green-50/30" : "border-transparent hover:border-primary-accent"
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-300 group-hover:border-primary-accent group-hover:text-primary-accent"
                                }`}>
                                {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </div>

                            <div className="flex-1">
                                <h3 className={`text-lg font-bold ${isCompleted ? "text-green-800 line-through opacity-70" : "text-primary-dark"}`}>
                                    Chapter {index + 1}: {chapter.title}
                                </h3>
                                <p className={`text-sm ${isCompleted ? "text-green-600" : "text-gray-500"}`}>{chapter.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
