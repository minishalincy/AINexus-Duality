'use client';

import { motion } from "framer-motion";
import { GraduationCap, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function MiniModulesPage() {
    const { t } = useTranslation();

    return (
        <div className="pb-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('mini_modules_title', 'Mini Modules')}</h1>
                <p className="text-gray-600">{t('mini_modules_subtitle', 'Choose your learning path below.')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* For Classroom Card */}
                <Link href="/mini-modules/grades">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 p-8 cursor-pointer hover:shadow-xl transition-all group h-full"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('for_classroom', 'For Classroom')}</h2>
                                <p className="text-sm text-gray-600 text-left">({t('grade_wise', 'Grade Wise')})</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6 text-left">
                            {t('classroom_desc', 'Access grade-specific teaching modules and classroom activities tailored to your students\' level.')}
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                            <span>{t('explore', 'Explore')}</span>
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                    </motion.div>
                </Link>

                {/* For Me Card */}
                <Link href="/mini-modules/teachers">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 p-8 cursor-pointer hover:shadow-xl transition-all group h-full"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('for_me', 'For Me')}</h2>
                                <p className="text-sm text-gray-600 text-left">({t('teacher_support', 'Teacher Support')})</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6 text-left">
                            {t('mini_modules_teacher_desc', 'Professional development videos to help you grow as an educator and manage your teaching journey.')}
                        </p>
                        <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-4 transition-all">
                            <span>{t('explore', 'Explore')}</span>
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
