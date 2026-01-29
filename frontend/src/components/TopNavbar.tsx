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

    
    useEffect(() => {
        const handleAnalysisStart = (e: CustomEvent<any>) => {
            const feedbackItem = e.detail;
            console.log("Analysis started for", feedbackItem.id);

            
            setTimeout(() => {
                const newNotification = {
                    id: Date.now(),
                    type: 'feedback_result',
                    text: `Your analysis for "${feedbackItem.preview}" is ready.`,
                    data: feedbackItem, 
                    read: false
                };

                setTodayReminders(prev => [newNotification, ...prev]);
                
                setBannerReminder({
                    id: String(newNotification.id),
                    text: newNotification.text,
                    time: "Now"
                });

                
                setTimeout(() => {
                    setBannerReminder(null);
                }, 5000);
            }, 30000); 
        };

        window.addEventListener('feedback-analysis-start', handleAnalysisStart as EventListener);
        return () => window.removeEventListener('feedback-analysis-start', handleAnalysisStart as EventListener);
    }, []);

    
    useEffect(() => {
        const fetchReminders = async () => {
            try {
                
                
                
                
                
                
                const { CalendarService } = await import("@/services/calendar");
                const all = await CalendarService.getReminders();
                
                
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

                const active = all.filter(r => r.date === today);
                setTodayReminders(active);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };
        fetchReminders();

        
        const interval = setInterval(fetchReminders, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        router.push('/teacher/login');
    };

    
    

    
    const [bannerReminder, setBannerReminder] = useState<any | null>(null);
    const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
    const [dueCount, setDueCount] = useState(0);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    
    useEffect(() => {
        const checkDueReminders = () => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeValue = currentHours * 60 + currentMinutes;

            let count = 0;

            todayReminders.forEach(r => {
                if (readIds.has(r.id)) return; 

                if (r.type === 'feedback_result') {
                    
                    count++;
                } else if (r.time) {
                    const [h, m] = r.time.split(':').map(Number);
                    const reminderTimeValue = h * 60 + m;

                    
                    if (currentTimeValue >= reminderTimeValue) {
                        count++;
                    }

                    
                    if (!notifiedIds.has(r.id) && h === currentHours && m === currentMinutes) {
                        setBannerReminder(r);
                        setNotifiedIds(prev => new Set(prev).add(r.id));

                        
                        setTimeout(() => {
                            setBannerReminder(null);
                        }, 5000);
                    }
                } else {
                    
                    
                    
                    count++;
                }
            });
            setDueCount(count);
        };

        
        checkDueReminders();
        const timer = setInterval(checkDueReminders, 10000); 
        return () => clearInterval(timer);
    }, [todayReminders, notifiedIds, readIds]);

    
    useEffect(() => {
        if (!notificationsOpen && todayReminders.length > 0) {
            
            
            
            
            
            

            
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeValue = currentHours * 60 + currentMinutes;

            const newRead = new Set(readIds);
            let updated = false;

            todayReminders.forEach(r => {
                const isDue = r.time ? ((parseInt(r.time.split(':')[0]) * 60 + parseInt(r.time.split(':')[1])) <= currentTimeValue) : true;

                if (isDue) {
                    if (!newRead.has(r.id)) {
                        newRead.add(r.id);
                        updated = true;
                    }
                }
            });

            if (updated) setReadIds(newRead);
        }
    }, [notificationsOpen, todayReminders, readIds]); 

    

    return (
        <>
            { }
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
                    { }
                    <div className="absolute bottom-0 left-0 h-1 bg-primary-500 animate-[width_5s_linear_forwards]" style={{ width: '100%' }}></div>
                </div>
            )}

            <header className="fixed top-0 left-0 right-0 h-20 bg-white text-gray-900 flex items-center justify-between px-4 md:px-8 z-50 shadow-md">
                { }
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

                { }
                <div className="flex items-center gap-6">
                    { }
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
                                                            
                                                            setNotificationsOpen(false);

                                                            
                                                            
                                                            
                                                            
                                                            
                                                            if (window.location.pathname !== '/teacher/dashboard' && window.location.pathname !== '/dashboard') {
                                                                router.push('/teacher/dashboard');
                                                                
                                                                setTimeout(() => {
                                                                    window.dispatchEvent(new CustomEvent('open-feedback-result', { detail: rem.data }));
                                                                }, 1000);
                                                            } else {
                                                                
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
                                        unoptimized 
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

            { }
            < EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)
            } />
        </>
    );
}
