"use client";

import { PlayCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function MiniModules() {
    const { t } = useTranslation();
    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-primary-dark mb-4">{t('recently_watched')}</h3>

            <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[150px] aspect-video bg-white rounded-xl border border-gray-200 flex items-center justify-center relative group cursor-pointer hover:border-primary-accent transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <PlayCircle size={24} fill="currentColor" className="text-orange-500 bg-white rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            <Link href="/mini-modules" className="block w-full">
                <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-primary-dark font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                    {t('watch_mini_modules')}
                </button>
            </Link>
        </div>
    );
}
