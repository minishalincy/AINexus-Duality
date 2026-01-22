'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { schools } from '@/lib/schools';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function TeacherRegister() {
    const router = useRouter();
    const { language } = useLanguage();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        school: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === 'teacher') {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(t("passwords_do_not_match"));
            return;
        }

        try {
            if (!navigator.onLine) {
                throw new Error(t('You are offline. Please connect to internet to register.') || 'You are offline. Please connect to internet to register.');
            }

            const response = await fetch('/api/teacher/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    school: formData.school,
                    password: formData.password,
                    preferred_language: language,
                }),
            });

            let data;
            try {
                data = await response.json();
            } catch {
                if (!response.ok) {
                    if (response.status === 500) {
                        throw new Error(t('Service unavailable. Please check your internet connection.') || 'Service unavailable. Please check your internet connection.');
                    }
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
            }

            if (!response.ok) {
                throw new Error(data?.detail || 'Registration failed');
            }

            // Store token and redirect
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', 'teacher');
            router.push('/dashboard');

        } catch (error: unknown) {
            const err = error as Error;
            console.error(err);
            setError(err.message || 'Registration failed');
        }
    };

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
                        {t('app_subtitle')}
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_60%)]"></div>
            </motion.div>

            {/* Right Column - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-primary-500"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('teacher_registration')}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('school')}</label>
                            <select
                                required
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
                            >
                                <option value="">{t('select_school')}</option>
                                {schools.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('confirm_password')}</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs mt-1 text-left">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-all transform active:scale-95"
                        >
                            {t('register')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {t('already_have_account')}{' '}
                        <Link href="/teacher/login" className="text-primary-600 hover:text-primary-800 font-medium">
                            {t('login_here')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
