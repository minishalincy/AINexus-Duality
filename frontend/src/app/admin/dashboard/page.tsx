'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
    const router = useRouter();
    const { language } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
            router.push('/admin/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-secondary-700 mb-4">CRP / ARP / BRP Dashboard</h1>
            <p className="text-xl text-gray-600">Administrator Panel. Language: {language}</p>
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Session Info</h2>
                <p className="text-gray-500">Logged in as Administrator</p>
            </div>
            <button
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    router.push('/');
                }}
                className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
        </div>
    );
}
