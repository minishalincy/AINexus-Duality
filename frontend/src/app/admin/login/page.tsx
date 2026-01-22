'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { schools } from '@/lib/schools';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
    const router = useRouter();
    const { language } = useLanguage();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        school: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    school: formData.school,
                    preferred_language: language
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', 'admin');
            router.push('/admin/dashboard');

        } catch (error: unknown) {
            console.error(error);
            const err = error as Error;
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Column - Branding */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex w-1/2 bg-secondary-700 items-center justify-center p-12 relative overflow-hidden"
            >
                <div className="z-10 text-center text-white">
                    <h1 className="text-6xl font-bold mb-6">{t('welcome')}</h1>
                    <p className="text-2xl text-secondary-100 max-w-md mx-auto">
                        {t('app_subtitle')}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_60%)]"></div>
            </motion.div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-secondary-500"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{t('admin_login')}</h2>
                        <p className="text-sm text-gray-500">{t('admin_login_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                placeholder="admin@assistai.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('school')}</label>
                            <select
                                required
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            >
                                <option value="">{t('select_school')}</option>
                                {schools.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs mt-1 text-left">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-semibold rounded-lg shadow-md transition-all transform active:scale-95"
                        >
                            {t('access_dashboard')}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <Link href="/role-selection" className="text-gray-400 hover:text-gray-600">
                            {t('back')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
