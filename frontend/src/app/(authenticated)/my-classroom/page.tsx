
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import AddClassModal from "@/components/dashboard/AddClassModal";
import ClassroomCard from "@/components/classroom/ClassroomCard";
import SyllabusTracker from "@/components/classroom/SyllabusTracker";
import { ClassroomService, Classroom } from "@/services/classroom";
import { SYLLABUS_DATA, DEFAULT_SYLLABUS } from "@/data/syllabusData";

export default function MyClassroomPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load Classrooms on Mount
    useEffect(() => {
        let mounted = true;
        const loadClassrooms = async () => {
            try {
                const data = await ClassroomService.getClassrooms();
                if (mounted) {
                    setClassrooms(data);
                    if (data.length > 0) {
                        // Select the first one by default as requested
                        setSelectedClassroom(data[0]);
                    }
                }
            } catch (error: unknown) {
                if (mounted) {
                    const err = error as Error;
                    console.error("Failed to load classrooms", err);
                    if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
                        console.log("Redirecting to login due to unauthorized error");
                        // Clear invalid token to prevent redirect loop in login page
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        router.push('/teacher/login');
                    }
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadClassrooms();

        return () => {
            mounted = false;
        };
    }, [router]);

    const handleAddClass = async (data: { grade: string; section: string; subjects: string[] }) => {
        try {
            const newClasses: Classroom[] = [];
            for (const subject of data.subjects) {
                const newClass = await ClassroomService.addClassroom({
                    grade: data.grade,
                    section: data.section,
                    subject: subject
                });
                newClasses.push(newClass);
            }

            setClassrooms(prev => [...prev, ...newClasses]);

            // "When the teacher adds subjects, the first added subject card must be automatically selected by default"
            if (newClasses.length > 0 && (!selectedClassroom || classrooms.length === 0)) {
                setSelectedClassroom(newClasses[0]);
            }
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Failed to add classroom", err);
            if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/teacher/login');
            } else {
                alert("Failed to add classroom. Please try again.");
            }
        }
    };

    const handleDeleteClass = async (id: string) => {
        if (!confirm(t('confirm_delete_class') || "Are you sure you want to delete this class?")) return;

        try {
            await ClassroomService.deleteClassroom(id);

            setClassrooms(prev => {
                const updated = prev.filter(c => c.id !== id);
                // If we deleted the selected classroom, select another one if available
                if (selectedClassroom?.id === id) {
                    setSelectedClassroom(updated.length > 0 ? updated[0] : null);
                }
                return updated;
            });
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Failed to delete classroom", err);
            if (err.message?.includes("Unauthorized") || err.message?.includes("401")) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/teacher/login');
            } else {
                alert("Failed to delete classroom");
            }
        }
    };

    // Helper to get syllabus for current classroom
    const getSyllabus = (cls: Classroom) => {
        // Ensure grade is treated as a string key
        const gradeKey = String(cls.grade);
        const gradeData = SYLLABUS_DATA[gradeKey];

        if (gradeData && gradeData[cls.subject]) {
            return gradeData[cls.subject];
        }

        // Debug fallback
        console.warn(`Syllabus not found for Grade: ${cls.grade} (${typeof cls.grade}), Subject: ${cls.subject}`);
        return DEFAULT_SYLLABUS;
    };

    return (
        <div className="space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('my_classroom')}</h1>
                    <p className="text-gray-600 mt-1">{t('my_classroom_subtitle') || "Manage your classes and subjects here."}</p>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
            ) : classrooms.length === 0 ? (
                // Empty State - Centered and Clear
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-300">
                    <div className="w-24 h-24 bg-primary-50 text-primary-accent rounded-full flex items-center justify-center mb-6">
                        <Plus size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Classrooms Yet</h2>
                    <p className="text-gray-500 max-w-md text-center mb-8">
                        Get started by adding your first class. Select your grade and subjects to begin tracking syllabus progress.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3 bg-primary-dark text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add New Class
                    </button>
                </div>
            ) : (
                <>
                    {/* Classroom Horizontal List */}
                    <div className="overflow-x-auto pb-4 -mx-4 px-4 sticky top-0 z-20 bg-[#F3F4F6]/95 backdrop-blur-sm pt-2">
                        <div className="flex items-center gap-4 w-max">
                            {classrooms.map(cls => (
                                <ClassroomCard
                                    key={cls.id}
                                    grade={cls.grade}
                                    section={cls.section}
                                    subject={cls.subject}
                                    isSelected={selectedClassroom?.id === cls.id}
                                    onClick={() => setSelectedClassroom(cls)}
                                    onDelete={() => handleDeleteClass(cls.id)}
                                />
                            ))}

                            {/* Add Button in the list flow */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="min-w-24 h-36 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary-accent hover:text-primary-accent hover:bg-primary-50 transition-all"
                            >
                                <Plus size={24} />
                                <span className="text-sm font-medium">Add Class</span>
                            </button>
                        </div>
                    </div>

                    {/* Selected Classroom Content */}
                    {selectedClassroom && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Syllabus Tracker */}
                            <div className="space-y-6">
                                <SyllabusTracker
                                    key={selectedClassroom.id}
                                    classroomId={selectedClassroom.id}
                                    syllabus={getSyllabus(selectedClassroom)}
                                    initialCompletedChapters={selectedClassroom.completed_chapters || []}
                                    onUpdateProgress={(chapters) => {
                                        // Optimistic update
                                        setClassrooms(prev => prev.map(c =>
                                            c.id === selectedClassroom.id
                                                ? { ...c, completed_chapters: chapters }
                                                : c
                                        ));
                                        ClassroomService.updateProgress(selectedClassroom.id, chapters);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            <AddClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddClass}
            />
        </div>
    );
}
