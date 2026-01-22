'use client';

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GRADES } from "../constants";
import { useTranslation } from "react-i18next";

export default function GradesPage() {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('for_classroom', 'For Classroom')}</h1>
                <p className="text-gray-600">{t('select_grade_msg', 'Select a grade to view grade-specific teaching modules.')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {GRADES.map((grade) => (
                    <Link key={grade.key} href={`/mini-modules/grades/${grade.key}`}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white rounded-xl border-2 border-blue-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all text-center group cursor-pointer h-full"
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition-colors">
                                <span className="text-2xl font-bold text-blue-600 group-hover:text-white transition-colors">
                                    {grade.number}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{grade.label}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t('click_to_view', 'Click to view')}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
