'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, LogOut, Camera, FileText, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TeacherNavbar() {
    const router = useRouter();
    const { t } = useLanguage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/teacher/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">

                    {/* Left: Logo */}
                    <Link href="/teacher/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Assist AI</span>
                    </Link>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4">

                        {/* Notification Icon */}
                        <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell className="w-6 h-6" />
                            {/* <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span> */}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <User className="w-6 h-6" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.1 }}
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 ring-1 ring-black ring-opacity-5 origin-top-right focus:outline-none"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">My Profile</p>
                                            <p className="text-xs text-gray-500 truncate">teacher@example.com</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => console.log('Edit Profile')}
                                            >
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                Edit Profile
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                onClick={() => console.log('Change Photo')}
                                            >
                                                <Camera className="w-4 h-4 text-gray-400" />
                                                Change Photo
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
