"use client";

import TopNavbar from "@/components/TopNavbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-soft-bg">
            <TopNavbar />
            <Sidebar />

            {/* Main Content Area - Shifted right by sidebar width and down by navbar height */}
            <main className="ml-64 pt-20 min-h-screen p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
