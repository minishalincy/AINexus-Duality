'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
    title: string;
    icon: LucideIcon;
    href: string;
    description?: string;
    comingSoon?: boolean;
    color?: string; // Tailwind bg class prefix e.g. 'bg-blue'
}

export default function DashboardCard({ title, icon: Icon, href, description, comingSoon, color = 'bg-white' }: DashboardCardProps) {
    return (
        <Link href={href} className="block group">
            <div className={`relative h-full p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:border-primary-200 overflow-hidden`}>

                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gray-50 text-primary-600 group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    {/* {comingSoon && (
                        <span className="px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-full border border-amber-100">
                            Soon
                        </span>
                    )} */}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {title}
                </h3>

                {description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Decorative background circle */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-50 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl"></div>
            </div>
        </Link>
    );
}
