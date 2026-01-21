"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, ChevronDown, User, Upload } from "lucide-react";

export default function TopNavbar() {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-primary-dark text-white flex items-center justify-between px-8 z-50 shadow-md">
            {/* Logo */}
            <div className="flex items-center gap-3">
                {/* Placeholder Logo Icon */}
                <div className="w-10 h-10 bg-primary-accent rounded-lg flex items-center justify-center">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold tracking-wide">Assist AI</h1>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="p-2 hover:bg-secondary-dark rounded-full transition-colors relative"
                    >
                        <Bell size={24} className="text-light-accent" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary-dark"></span>
                    </button>

                    {notificationsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white text-primary-dark rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 border-b border-gray-100 font-semibold text-sm text-secondary-dark">Notifications</div>
                            <div className="max-h-64 overflow-y-auto">
                                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                                    <p className="text-sm font-medium">Your class has started</p>
                                    <p className="text-xs text-gray-500 mt-1">10:00 AM - Class 7 Science</p>
                                </div>
                                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                                    <p className="text-sm font-medium">Prepare for today's Science lesson</p>
                                    <p className="text-xs text-gray-500 mt-1">Upcoming at 11:30 AM</p>
                                </div>
                                <div className="px-4 py-3 hover:bg-gray-50">
                                    <p className="text-sm font-medium">You have pending tasks</p>
                                    <p className="text-xs text-gray-500 mt-1">3 tasks remaining for today</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 hover:bg-secondary-dark px-3 py-2 rounded-lg transition-colors"
                    >
                        <div className="w-10 h-10 bg-primary-accent rounded-full flex items-center justify-center text-white font-bold border-2 border-light-accent">
                            M
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold leading-none">Minisha</p>
                            <p className="text-xs text-blue-200 mt-1">123@gmail.com</p>
                        </div>
                        <ChevronDown size={18} className="text-blue-300" />
                    </button>

                    {profileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white text-primary-dark rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                                <User size={16} /> Edit Profile
                            </button>
                            <button className="w-full text-left px-4 py-3 hover:bg-red-50 text-logout-red flex items-center gap-2 text-sm font-medium border-t border-gray-50">
                                <Upload size={16} className="rotate-90" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
