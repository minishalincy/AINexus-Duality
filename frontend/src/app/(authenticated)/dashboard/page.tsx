'use client';

import { useTranslation } from "react-i18next";
import AssistAIWidget from "@/components/widgets/AssistAIWidget";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import FeedbackNotes from "@/components/widgets/FeedbackNotes";

export default function DashboardPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('good_morning')}</h1>
                <p className="text-gray-600 mt-1">{t('inspire_msg')}</p>
            </div>

            {/* Widgets Grid */}
            <div className="space-y-8">
                {/* 1. Assist AI - Full Width */}
                <section>
                    <AssistAIWidget />
                </section>

                {/* 2 Column Grid for Calendar & Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* 2. Calendar Widget */}
                    <section className="h-full">
                        <CalendarWidget />
                    </section>

                    {/* 3. Feedback Widget */}
                    <section className="h-full">
                        <FeedbackNotes />
                    </section>
                </div>
            </div>
        </div>
    );
}
