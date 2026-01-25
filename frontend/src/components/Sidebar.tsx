"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, LogOut, School, PlayCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 bg-white text-gray-900 border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 pt-24 z-40 shadow-md
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}>
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="flex justify-end px-4 mb-2 md:hidden">
                        <button onClick={onClose} className="p-2 text-white/70 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="space-y-2 px-4">
                        <Link
                            href="/dashboard"
                            prefetch={false}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/dashboard"
                                ? "bg-primary-50 text-primary-700 font-medium border-r-4 border-primary-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                                }`}
                        >
                            <LayoutDashboard size={20} />
                            <span>{t('dashboard')}</span>
                        </Link>
                        <Link
                            href="/my-classroom"
                            prefetch={false}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/my-classroom"
                                ? "bg-primary-50 text-primary-700 font-medium border-r-4 border-primary-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                                }`}
                        >
                            <School size={20} />
                            <span>{t('my_classroom')}</span>
                        </Link>
                        <Link
                            href="/mini-modules"
                            prefetch={false}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/mini-modules"
                                ? "bg-primary-50 text-primary-700 font-medium border-r-4 border-primary-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                                }`}
                        >
                            <PlayCircle size={20} />
                            <span>{t('watch_mini_modules')}</span>
                        </Link>

                    </nav>
                </div>

                <div className="p-4 mb-4">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left bg-red-50 text-red-600 rounded-lg  font-medium group cursor-pointer">
                        <LogOut size={20} className="group-hover:text-red-600" />
                        <span>{t('logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
