'use client';

import TeacherNavbar from '@/components/TeacherNavbar';
import { useLanguage } from '@/context/LanguageContext';

export default function AIWorkspace() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 text-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 inline-block">
                    <h1 className="text-4xl font-bold text-primary-700 mb-4">{t('ai_workspace_title')}</h1>
                    <p className="text-xl text-gray-500">{t('ai_workspace_desc')}</p>
                </div>
            </main>
        </div>
    );
}
