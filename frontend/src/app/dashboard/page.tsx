"use client";

import WelcomeSection from "@/components/dashboard/WelcomeSection";
import SubjectGrid from "@/components/dashboard/SubjectGrid";
import AssistAIWidget from "@/components/widgets/AssistAIWidget";
import FeedbackNotes from "@/components/widgets/FeedbackNotes";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import MiniModules from "@/components/widgets/MiniModules";
import { Mic, Image as ImageIcon, Send } from "lucide-react"; // Renamed Image to avoid conflict

export default function DashboardPage() {
    return (
        <div className="pb-24"> {/* Padding for potential fixed bottom elements if any, layout handles main padding */}
            <WelcomeSection />

            <section className="bg-white/40 border border-white/60 rounded-3xl p-8 mb-8 backdrop-blur-sm shadow-sm">
                <SubjectGrid />
            </section>

            {/* Assist AI Widget */}
            <div className="mb-8">
                <AssistAIWidget />
            </div>

            {/* Feedback Notes and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="min-h-[350px]">
                    <FeedbackNotes />
                </div>

                <div className="min-h-[350px]">
                    <CalendarWidget />
                </div>
            </div>

            {/* Mini Modules */}
            <div className="mb-8">
                <MiniModules />
            </div>
        </div>
    );
}
