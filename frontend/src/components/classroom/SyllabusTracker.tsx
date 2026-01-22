
import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { ClassroomService } from "@/services/classroom";

interface SyllabusTrackerProps {
    classroomId: string;
    initialCompletedChapters: number[];
    syllabus: string[];
    onUpdateProgress?: (chapters: number[]) => void;
}

export default function SyllabusTracker({ classroomId, initialCompletedChapters, syllabus = [], onUpdateProgress }: SyllabusTrackerProps) {
    // Derived state to avoid direct setState in effect
    const [completed, setCompleted] = useState<number[]>(initialCompletedChapters || []);
    
    // Sync state if props change (important when switching classrooms)
    useEffect(() => {
        setCompleted(initialCompletedChapters || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(initialCompletedChapters), classroomId]);

    const toggleChapter = async (index: number) => {
        const isCompleted = completed.includes(index);
        let newCompleted;
        if (isCompleted) {
            newCompleted = completed.filter(i => i !== index);
        } else {
            newCompleted = [...completed, index];
        }

        setCompleted(newCompleted);

        if (onUpdateProgress) {
            onUpdateProgress(newCompleted);
        } else {
            // Fallback: update directly if no callback provided
            try {
                await ClassroomService.updateProgress(classroomId, newCompleted);
            } catch (error) {
                console.error("Failed to save progress", error);
            }
        }
    };

    // Safe guard against empty syllabus
    if (!syllabus || syllabus.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Syllabus Tracker</h3>
                <p className="text-gray-500 italic">No syllabus data available for this subject.</p>
            </div>
        );
    }

    const progress = Math.round((completed.length / syllabus.length) * 100);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Syllabus Tracker</h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary-accent">{progress}% Completed</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-accent transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {syllabus.map((chapter, idx) => {
                    const isDone = completed.includes(idx);
                    return (
                        <div
                            key={idx}
                            onClick={() => toggleChapter(idx)}
                            className={`
                                p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all
                                ${isDone
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center shrink-0
                                ${isDone ? 'text-green-500' : 'text-gray-300'}
                            `}>
                                {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </div>
                            <span className={`font-medium ${isDone ? 'text-green-800' : 'text-gray-600'}`}>
                                {chapter}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
