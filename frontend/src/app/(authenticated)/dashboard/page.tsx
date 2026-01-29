"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AssistAIWidget from "@/components/widgets/AssistAIWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import FeedbackNotes from "@/components/widgets/FeedbackNotes";
import { ProfileService } from "@/services/profile";

export default function DashboardPage() {
    const { t } = useTranslation();
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("Teacher"); 
    const [loadingName, setLoadingName] = useState(true);

    useEffect(() => {
        
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting(t('good_morning') || "Good Morning");
        else if (hour >= 12 && hour < 17) setGreeting(t('good_afternoon') || "Good Afternoon");
        else setGreeting(t('good_evening') || "Good Evening");

        
        const fetchProfile = async () => {
            try {
                const profile = await ProfileService.getProfile();
                if (profile.name) {
                    setUserName(profile.name);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
                
            } finally {
                setLoadingName(false);
            }
        };

        fetchProfile();
    }, [t]);

    return (
        <div className="space-y-6 w-full">
            { }
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {greeting}, <span className="text-primary-600">{userName}</span>
                </h1>
                <p className="text-gray-600 mt-2 text-lg">{t('inspire_msg')}</p>
            </div>

            { }
            <div className="space-y-6">
                { }
                <section className="w-full">
                    <AssistAIWidget />
                </section>

                { }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full">
                    { }
                    <section className="h-full min-h-[400px]">
                        <FeedbackNotes />
                    </section>

                    { }
                    <section className="h-full min-h-[400px]">
                        <CalendarWidget />
                    </section>
                </div>
            </div>
        </div>
    );
}
