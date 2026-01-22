"use client";

import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-soft-bg">
            <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area - Shifted right by sidebar width and down by navbar height */}
            <main className="md:ml-64 ml-0 pt-24 min-h-screen px-4 pb-4 md:px-8 md:pb-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
