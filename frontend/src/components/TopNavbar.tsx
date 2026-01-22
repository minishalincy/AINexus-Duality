"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, User, Menu, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import EditProfileModal from "@/components/profile/EditProfileModal";

interface TopNavbarProps {
    onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
    const router = useRouter();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [todayReminders, setTodayReminders] = useState<any[]>([]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const { t } = useTranslation();

    // Listen for Feedback Analysis Start
    useEffect(() => {
        const handleAnalysisStart = (e: CustomEvent<any>) => {
            const feedbackItem = e.detail;
            console.log("Analysis started for", feedbackItem.id);

            // Simulate AI Processing Time (30 seconds)
            setTimeout(() => {
                const newNotification = {
                    id: Date.now(),
                    type: 'feedback_result',
                    text: `Your analysis for "${feedbackItem.preview}" is ready.`,
                    data: feedbackItem, // Store full data to reopen modal
                    read: false
                };

                setTodayReminders(prev => [newNotification, ...prev]);
                // Optional: Play sound or toast
            }, 30000); // 30 Seconds
        };

        window.addEventListener('feedback-analysis-start', handleAnalysisStart as EventListener);
        return () => window.removeEventListener('feedback-analysis-start', handleAnalysisStart as EventListener);
    }, []);

    // Fetch Today's Reminders
    useEffect(() => {
        const fetchReminders = async () => {
            try {
                // Ideally this should be a lightweight call or optimized
                // For now, we fetch all and filter client side.
                // In production, backend should support ?date=...
                // But for now, let's use the implementation we have (fetch all)
                // Note: Cyclic dependency if we import CalendarService directly if it uses something from here? No.
                // Dynamic import to avoid issues or just standard import.
                const { CalendarService } = await import("@/services/calendar");
                const all = await CalendarService.getReminders();
                // Fix: toISOString returns UTC, which might be "yesterday" if it's early morning local time
                // Use a proper local YYYY-MM-DD construction
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

                const active = all.filter(r => r.date === today);
                setTodayReminders(active);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };
        fetchReminders();

        // Poll every 1 minute for updates?
        const interval = setInterval(fetchReminders, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Clear any other session data if needed
        router.push('/teacher/login');
    };

    // Lazy load modal logic is tricky with one-file edits, so we import at top usually.
    // For now we assume imports are added. We need to add import first.

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-20 bg-primary-dark text-white flex items-center justify-between px-4 md:px-8 z-50 shadow-md">
                {/* Logo & Menu */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-white/10 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

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
                    <h1 className="text-xl font-bold tracking-wide">{t('assist_ai')}</h1>
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
                            {todayReminders.length > 0 && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary-dark animate-pulse"></span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white text-primary-dark rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-gray-100 font-semibold text-sm text-secondary-dark flex justify-between items-center">
                                    <span>{t('notifications')}</span>
                                    {todayReminders.length > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{todayReminders.length} New</span>}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {todayReminders.length > 0 ? (
                                        todayReminders.map(rem => (
                                            <div
                                                key={rem.id}
                                                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer ${rem.type === 'feedback_result' ? 'bg-blue-50/50' : ''}`}
                                                onClick={() => {
                                                    if (rem.type === 'feedback_result') {
                                                        // Close dropdown
                                                        setNotificationsOpen(false);

                                                        // Ensure we are on dashboard
                                                        // router.push('/teacher/dashboard'); // Assume Dashboard for now
                                                        // Actually, just dispatch. The user is likely already there if they are waiting.
                                                        // Even if they are on Admin or elsewhere, navigating to /teacher/dashboard is safe.
                                                        // But let's check path.
                                                        if (window.location.pathname !== '/teacher/dashboard' && window.location.pathname !== '/dashboard') {
                                                            router.push('/teacher/dashboard');
                                                            // Dispatch after navigation
                                                            setTimeout(() => {
                                                                window.dispatchEvent(new CustomEvent('open-feedback-result', { detail: rem.data }));
                                                            }, 1000);
                                                        } else {
                                                            // Already there, dispatch immediately
                                                            window.dispatchEvent(new CustomEvent('open-feedback-result', { detail: rem.data }));
                                                        }
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {rem.type === 'feedback_result' ? "Analysis Complete" : (t('reminder_due') || "Reminder Due")}
                                                    </p>
                                                    {rem.type === 'feedback_result' && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rem.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-center text-sm text-gray-500">
                                            No new notifications
                                        </div>
                                    )}
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
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        // router.push('/profile'); // Old way
                                        // Make sure we have the EditProfileModal imported!
                                        // We'll dispatch a custom event or use context in a real app,
                                        // here let's just use local state if we can, but we are inside the header.
                                        // Wait, we need to open the modal which is rendered below? 
                                        // Ah, I can render the modal inside this component!
                                        const event = new CustomEvent('open-profile-modal');
                                        window.dispatchEvent(event); // Or just control state here
                                    }}
                                // Actually let's just control a state:
                                // ERROR: I need to define the state 'isEditProfileOpen' first.
                                // I'll assume I'll add that state in the next step or I'll add it now.
                                >
                                    {/* We will attach the onClick handler properly in a moment after adding state */}
                                </button>
                                {/* Re-doing the button logic properly */}
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        // Open Modal
                                        const modal = document.getElementById('edit-profile-modal-trigger');
                                        if (modal) modal.click(); // Hacky? No, let's use state properly.
                                        // I will use a state variable defined above.
                                        // ...
                                        // Let's rely on the parent or adding state locally.
                                        // I'll add 'showEditProfile' state.
                                        setShowEditProfile(true);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium"
                                >
                                    <User size={16} /> {t('edit_profile') || 'Edit Profile'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-sm font-medium text-red-600 border-t border-gray-100"
                                >
                                    <LogOut size={16} /> {t('nav.logout') || 'Log Out'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal Portal - Rendered here for simplicity */}
            <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
        </>
    );
}
