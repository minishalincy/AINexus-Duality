"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { GRADES, GRADE_VIDEO_DATA, GradeLevel } from "../../constants";

export default function GradeDetailPage({ params }: { params: Promise<{ gradeId: string }> }) {
    const { t } = useTranslation();
    const resolvedParams = React.use(params);
    const gradeId = resolvedParams.gradeId as GradeLevel;

    // Validate gradeId
    const gradeInfo = GRADES.find(g => g.key === gradeId);

    // Get videos for this grade
    const videos = GRADE_VIDEO_DATA[gradeId] || [];

    if (!gradeInfo) {
        return <div className="p-8">Invalid Grade</div>;
    }

    return (
        <div className="pb-24">
            <Link
                href="/mini-modules/grades"
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors inline-block"
            >
                <ArrowLeft size={20} />
                <span>{t('back_to_grades', 'Back to Grades')}</span>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {gradeInfo.label} - {t('classroom_modules', 'Classroom Modules')}
                </h1>
                <p className="text-gray-600">{t('grade_modules_subtitle', 'Select a video to start learning')}</p>
            </div>

            {videos.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">{t('no_video', 'No video available')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <Link key={video.id} href={`/mini-modules/grades/${gradeId}/${video.id}`}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
                            >
                                <div className="aspect-video bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-500">
                                    <PlayCircle size={48} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {t(video.titleKey, video.titleKey)}
                                </h3>
                                <div className="mt-auto pt-2 flex items-center text-sm text-gray-500">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                        Video {index + 1}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
