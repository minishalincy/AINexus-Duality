"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, User, Menu, LogOut, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProfileService, TeacherProfile } from "@/services/profile";
import EditProfileModal from "@/components/profile/EditProfileModal";
import Image from "next/image";

interface TopNavbarProps {
    onMenuClick: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
    const router = useRouter();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [todayReminders, setTodayReminders] = useState<any[]>([]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(null);
    const { t } = useTranslation();

    const fetchProfile = async () => {
        try {
            const profile = await ProfileService.getProfile();
            setCurrentUser(profile);
        } catch (error) {
            console.error("Failed to load profile", error);
        }
    };

    useEffect(() => {
        fetchProfile();

        const handleProfileUpdate = () => {
            fetchProfile();
        };

        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => window.removeEventListener('profile-updated', handleProfileUpdate);
    }, []);

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
                // Trigger banner for feedback too?
                setBannerReminder({
                    id: String(newNotification.id),
                    text: newNotification.text,
                    time: "Now"
                });

                // Hide after 5s
                setTimeout(() => {
                    setBannerReminder(null);
                }, 5000);
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

    // Banner State
    const [bannerReminder, setBannerReminder] = useState<any | null>(null);
    const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
    const [dueCount, setDueCount] = useState(0);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    // Check for Due Reminders
    useEffect(() => {
        const checkDueReminders = () => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeValue = currentHours * 60 + currentMinutes;

            let count = 0;

            todayReminders.forEach(r => {
                if (readIds.has(r.id)) return; // Skip if read

                if (r.type === 'feedback_result') {
                    // Feedback results are immediate/always due once present
                    count++;
                } else if (r.time) {
                    const [h, m] = r.time.split(':').map(Number);
                    const reminderTimeValue = h * 60 + m;

                    // Badge Condition: Time has passed or is now
                    if (currentTimeValue >= reminderTimeValue) {
                        count++;
                    }

                    // Banner Condition: Exact Minute Match (and not notified yet)
                    if (!notifiedIds.has(r.id) && h === currentHours && m === currentMinutes) {
                        setBannerReminder(r);
                        setNotifiedIds(prev => new Set(prev).add(r.id));

                        // Auto dismiss after 5 seconds
                        setTimeout(() => {
                            setBannerReminder(null);
                        }, 5000);
                    }
                } else {
                    // No time specified = All day -> Count it? 
                    // User complained about "1 minute before", implying there WAS a time.
                    // For all-day tasks, maybe we count them always?
                    count++;
                }
            });
            setDueCount(count);
        };

        // Run immediately and then interval
        checkDueReminders();
        const timer = setInterval(checkDueReminders, 10000); // Check every 10s
        return () => clearInterval(timer);
    }, [todayReminders, notifiedIds, readIds]);

    // Mark as read when dropdown closes
    useEffect(() => {
        if (!notificationsOpen && todayReminders.length > 0) {
            // When closing, mark currently due items as read?
            // Or maybe just mark them read.
            // Simplified: If we opened the dropdown, we assume the user saw everything that was there.
            // So we add all "due" items to readIds.
            // Actually, we should capture the 'due' IDs at the moment of viewing.
            // But doing it on close is fine.

            // Let's filter 'due' items and add them.
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeValue = currentHours * 60 + currentMinutes;

            const newRead = new Set(readIds);
            let updated = false;

            todayReminders.forEach(r => {
                if (r.time) {
                    const [h, m] = r.time.split(':').map(Number);
                    if ((h * 60 + m) <= currentTimeValue) {
                        newRead.add(r.id);
                        updated = true;
                    }
                } else {
                    newRead.add(r.id); // All day / feedback
                    updated = true;
                }
            });

            if (updated) setReadIds(newRead);
        }
    }, [notificationsOpen, todayReminders, readIds]); // Trigger on open/close toggle. Specifically check !notificationsOpen inside.

    // ... (rest of render)

    return (
        <>
            {/* Banner Notification */}
            {bannerReminder && (
                <div
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md border border-primary-100 shadow-xl rounded-2xl px-6 py-4 z-[60] flex items-center gap-4 animate-in slide-in-from-top-10 fade-in duration-300 w-[90%] max-w-md cursor-pointer"
                    onClick={() => {
                        setNotificationsOpen(true);
                        setBannerReminder(null);
                    }}
                >
                    <div className="bg-primary-100 text-primary-600 p-2 rounded-full">
                        <Clock size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">{bannerReminder.text}</p>
                        <p className="text-xs text-gray-500">Scheduled: {bannerReminder.time}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setBannerReminder(null); }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <ChevronDown className="rotate-180" size={20} />
                    </button>
                    {/* Progress Bar (Visual flair for 5s timeout) */}
                    <div className="absolute bottom-0 left-0 h-1 bg-primary-500 animate-[width_5s_linear_forwards]" style={{ width: '100%' }}></div>
                </div>
            )}

            <header className="fixed top-0 left-0 right-0 h-20 bg-white text-gray-900 flex items-center justify-between px-4 md:px-8 z-50 shadow-md">
                {/* Logo & Menu */}
                <div className="flex items-center gap-2">
                    <button onClick={onMenuClick} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <Menu size={24} />
                    </button>
                    <div className="relative h-10 w-40">
                        <Image
                            src="/images/logo.png"
                            alt="Assist AI"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative text-gray-600 hover:text-primary-600 cursor-pointer"
                        >
                            <Bell size={24} />
                            {dueCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                                    {dueCount}
                                </span>
                            )}
                        </button>

                        {
                            notificationsOpen && (
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
                            )
                        }
                    </div >

                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            {currentUser?.profile_picture ? (
                                <div className="w-10 h-10 rounded-full border-2 border-primary-100 overflow-hidden relative">
                                    <Image
                                        src={currentUser.profile_picture}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                        unoptimized // Since we might be using base64 or external
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-full flex items-center justify-center font-bold border-2 border-primary-100">
                                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
                                </div>
                            )}

                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold leading-none text-gray-900">{currentUser?.name || "Loading..."}</p>
                                <p className="text-xs text-gray-500 mt-1">{currentUser?.email || ""}</p>
                            </div>
                            <ChevronDown size={18} className="text-gray-400" />
                        </button>

                        {
                            profileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white text-primary-dark rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            setShowEditProfile(true);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium cursor-pointer"
                                    >
                                        <User size={16} /> {t('edit_profile') || 'Edit Profile'}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-sm font-medium text-red-600 border-t border-gray-100 cursor-pointer"
                                    >
                                        <LogOut size={16} /> {t('nav.logout') || 'Log Out'}
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </header >

            {/* Modal Portal - Rendered here for simplicity */}
            < EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)
            } />
        </>
    );
}
