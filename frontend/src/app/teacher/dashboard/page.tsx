'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Video, Sparkles, BarChart, Users, Mic } from 'lucide-react';
import TeacherNavbar from '@/components/TeacherNavbar';
import DashboardCard from '@/components/DashboardCard';
import { useLanguage } from '@/context/LanguageContext';

export default function TeacherDashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/teacher/login');
            return;
        }
        setUser({ name: "Teacher" });
    }, [router]);

    const items = [
        { title: t('dashboard_home'), icon: Home, href: '/teacher/dashboard', description: "Main dashboard landing" },
        { title: "Daily Feedback", icon: Mic, href: '/teacher/daily-feedback', description: "Share your day in 1 minute" },
        { title: t('mini_module_recordings'), icon: Video, href: '/teacher/recordings', description: "View recorded content", comingSoon: true },
        { title: t('ai_assistant'), icon: Sparkles, href: '/teacher/ai', description: "Chat with Assist AI" },
        { title: t('insights'), icon: BarChart, href: '/teacher/insights', description: "Analytics & reports", comingSoon: true },
        { title: t('peer_support'), icon: Users, href: '/teacher/community', description: "Teacher-to-teacher help", comingSoon: true },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <TeacherNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('teacher_dashboard')}</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Access your tools below.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <DashboardCard
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            href={item.href}
                            description={item.description}
                            comingSoon={item.comingSoon}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
