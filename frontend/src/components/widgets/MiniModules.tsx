"use client";

import { PlayCircle } from "lucide-react";

export default function MiniModules() {
    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-primary-dark mb-4">Recently Watched</h3>

            <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[150px] aspect-video bg-white rounded-xl border border-gray-200 flex items-center justify-center relative group cursor-pointer hover:border-primary-accent transition-colors">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <PlayCircle size={24} fill="currentColor" className="text-orange-500 bg-white rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-primary-dark font-bold hover:bg-gray-50 transition-colors shadow-sm">
                Watch Mini Modules
            </button>
        </div>
    );
}
