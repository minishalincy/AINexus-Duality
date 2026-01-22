'use client';

import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WelcomeSection() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex justify-between items-end px-4 md:px-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        {t('good_morning')}
                        <CloudSun className="text-primary-500" size={32} />
                    </h1>
                    <p className="text-gray-500 text-lg mt-1">{t('inspire_msg')}</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
