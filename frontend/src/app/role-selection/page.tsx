'use client';

import { motion } from 'framer-motion';
import { User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function RoleSelection() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Column - Branding */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex w-1/2 bg-primary-700 items-center justify-center p-12 relative overflow-hidden"
            >
                <div className="z-10 text-center text-white">
                    <h1 className="text-6xl font-bold mb-6">{t('welcome')}</h1>
                    <p className="text-2xl text-primary-100 max-w-md mx-auto">
                        {t('role_selection_subtitle')}
                    </p>
                </div>
                {/* Abstract shapes for visual interest */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.8),_transparent_60%)]"></div>
            </motion.div>

            {/* Right Column - Selection */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('get_started')}</h2>
                        <p className="text-gray-600">{t('select_role')}</p>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/teacher/login')}
                            className="w-full flex items-center p-6 bg-white rounded-xl shadow-md border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all"
                        >
                            <div className="bg-primary-100 p-4 rounded-full mr-6">
                                <User className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-gray-900">{t('teacher')}</h3>
                                <p className="text-gray-500 text-sm">{t('teacher_desc')}</p>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/admin/login')}
                            className="w-full flex items-center p-6 bg-white rounded-xl shadow-md border-2 border-transparent hover:border-secondary-500 hover:shadow-lg transition-all"
                        >
                            <div className="bg-secondary-100 p-4 rounded-full mr-6">
                                <ShieldCheck className="w-8 h-8 text-secondary-600" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-gray-900">CRP / BRP / ARP</h3>
                                {/* <p className="text-gray-500 text-sm">{t('admin_desc')}</p> Removed desc as requested */}
                            </div>
                        </motion.button>
                    </div>

                    <div className="mt-12 text-center">
                        <button onClick={() => router.replace('/')} className="text-gray-400 hover:text-gray-600 text-sm">
                            {t('back')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
