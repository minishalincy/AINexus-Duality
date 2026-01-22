"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TEACHER_CATEGORIES, TEACHER_VIDEO_DATA, TeacherCategory } from "../../constants";

export default function TeacherCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { t } = useTranslation();
    const resolvedParams = React.use(params);
    const categoryId = resolvedParams.category as TeacherCategory;

    // Validate category
    const categoryInfo = TEACHER_CATEGORIES.find(c => c.key === categoryId);

    // Get videos for this category
    const videos = TEACHER_VIDEO_DATA[categoryId] || [];

    if (!categoryInfo) {
        return <div className="p-8">Invalid Category</div>;
    }

    return (
        <div className="pb-24">
            <Link
                href="/mini-modules/teachers"
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors inline-block"
            >
                <ArrowLeft size={20} />
                <span>{t('back_to_categories', 'Back to Categories')}</span>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {categoryInfo.label}
                </h1>
                <p className="text-gray-600">{t('teacher_video_subtitle', 'Select a video to start learning')}</p>
            </div>

            {videos.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">{t('coming_soon', 'Coming soon')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <Link key={video.id} href={`/mini-modules/teachers/${categoryId}/${video.id}`}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
                            >
                                <div className="aspect-video bg-purple-50 rounded-lg flex items-center justify-center mb-4 text-purple-500">
                                    <PlayCircle size={48} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {t(video.titleKey, video.titleKey)}
                                </h3>
                                <div className="mt-auto pt-2 flex items-center text-sm text-gray-500">
                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
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
