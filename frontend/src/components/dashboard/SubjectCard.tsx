"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface SubjectCardProps {
    grade: string;
    section: string;
    subject: string;
    id: string; // unique idea
}

export default function SubjectCard({ grade, section, subject, id }: SubjectCardProps) {
    return (
        <Link href={`/dashboard/subject/${id}`}>
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary-accent group cursor-pointer h-full flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                {/* Top decorative bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary-dark group-hover:bg-primary-accent transition-colors"></div>

                <div className="w-12 h-12 rounded-full bg-soft-bg flex items-center justify-center text-primary-dark group-hover:scale-110 transition-transform">
                    <GraduationCap size={24} />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-primary-dark group-hover:text-primary-accent transition-colors">
                        Class {grade}-{section}
                    </h3>
                    <p className="text-gray-500 font-medium">{subject}</p>
                </div>
            </div>
        </Link>
    );
}
