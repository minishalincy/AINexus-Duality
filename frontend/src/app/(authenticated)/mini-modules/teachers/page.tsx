'use client';

import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { TEACHER_CATEGORIES, TEACHER_VIDEO_DATA } from "../constants";
import { useTranslation } from "react-i18next";

export default function TeacherSupportPage() {
    const { t } = useTranslation();

    return (
        <div className="pb-24">
            <Link
                href="/mini-modules"
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors inline-block"
            >
                <ArrowLeft size={20} />
                <span>{t('back', 'Back')}</span>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('teacher_support', 'Teacher Support')}</h1>
                <p className="text-gray-600">{t('select_category_msg', 'Select a category to view training videos.')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEACHER_CATEGORIES.map((category) => {
                    const hasVideos = TEACHER_VIDEO_DATA[category.key] && TEACHER_VIDEO_DATA[category.key].length > 0;

                    const CardContent = (
                        <motion.div
                            whileHover={{ scale: hasVideos ? 1.02 : 1 }}
                            whileTap={{ scale: hasVideos ? 0.98 : 1 }}
                            className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all text-left group h-full ${hasVideos
                                ? 'border-primary-300 hover:border-primary-500 cursor-pointer'
                                : 'border-gray-200 opacity-60 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${hasVideos
                                    ? 'bg-primary-100 group-hover:bg-primary-500'
                                    : 'bg-gray-100'
                                    }`}>
                                    <PlayCircle className={`w-6 h-6 transition-colors ${hasVideos
                                        ? 'text-primary-600 group-hover:text-white'
                                        : 'text-gray-400'
                                        }`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{t(category.key, category.label)}</h3>
                                    {hasVideos && (
                                        <span className="text-xs text-green-600 font-medium">{t('available', 'Available')}</span>
                                    )}
                                </div>
                            </div>
                            <p className={`text-sm ${hasVideos ? 'text-gray-500' : 'text-gray-400'}`}>
                                {hasVideos ? t('click_to_view_videos', 'Click to view videos') : t('coming_soon', 'Coming soon')}
                            </p>
                        </motion.div>
                    );

                    return hasVideos ? (
                        <Link key={category.key} href={`/mini-modules/teachers/${category.key}`}>
                            {CardContent}
                        </Link>
                    ) : (
                        <div key={category.key}>
                            {CardContent}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
