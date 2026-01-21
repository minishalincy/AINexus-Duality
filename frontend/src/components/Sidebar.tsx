"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, LogOut } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-primary-dark text-white flex flex-col h-screen fixed left-0 top-0 pt-20 z-40">
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === "/dashboard"
                            ? "bg-secondary-dark font-medium border-l-4 border-light-accent"
                            : "hover:bg-secondary-dark/50"
                            }`}
                    >
                        <LayoutDashboard size={20} className="text-light-accent" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors opacity-70 cursor-not-allowed hover:bg-transparent ${pathname === "/dashboard/analytics"
                            ? "bg-secondary-dark font-medium"
                            : ""
                            }`}
                    >
                        <BarChart2 size={20} />
                        <span>Analytics</span>
                    </Link>
                </nav>
            </div>

            <div className="p-4 mb-4">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-left bg-logout-red text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}
