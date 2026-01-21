"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Clock } from "lucide-react";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// Mock Data
const INITIAL_TASKS = {
    "2026-01-24": [
        { id: 1, title: "Vasant Panchami", type: "holiday" },
        { id: 2, title: "Submit Grades", type: "work" }
    ],
    "2026-01-26": [
        { id: 3, title: "Republic Day", type: "holiday" }
    ]
};

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tasks, setTasks] = useState<any>(INITIAL_TASKS);

    // Calendar Logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun

    // Adjust so Monday is 0
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
    const selectedTasks = tasks[formattedSelectedDate] || [];

    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-sm h-full flex flex-col md:flex-row gap-6">
            {/* Left: Calendar Grid */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4 bg-white/50 p-2 rounded-xl">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-lg"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-primary-dark">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-lg"><ChevronRight size={20} /></button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {DAYS.map(d => (
                        <div key={d} className="text-xs font-medium text-gray-500">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = new Date(year, month, day).toISOString().split('T')[0]; // Simple format
                        // Fix timezone issue in production by using local date construction properly, 
                        // but for this UI demo string manip is fine if consistent.
                        // Better:
                        const dObj = new Date(year, month, day);
                        const isToday = new Date().toDateString() === dObj.toDateString();
                        const isSelected = selectedDate.toDateString() === dObj.toDateString();

                        // reconstruct key for task lookup to match state
                        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const hasTask = tasks[key];

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dObj)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all
                            ${isSelected ? "bg-primary-accent text-white shadow-md scale-105" : "hover:bg-white/50 text-gray-700"}
                            ${isToday && !isSelected ? "border border-primary-accent text-primary-accent font-bold" : ""}
                        `}
                            >
                                {day}
                                {hasTask && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-400"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Task List */}
            <div className="w-full md:w-48 bg-primary-dark text-white rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-2xl font-bold block">{selectedDate.getDate()}</span>
                        <span className="text-sm opacity-80">{selectedDate.toLocaleString('default', { weekday: 'short' })}</span>
                    </div>
                    <button className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
                        <Clock size={12} /> <span>{selectedTasks.length} pending tasks</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                    {selectedTasks.length > 0 ? (
                        selectedTasks.map((t: any) => (
                            <div key={t.id} className={`p-2 rounded-lg text-xs font-medium ${t.type === 'holiday' ? 'bg-green-500/20 text-green-100 border border-green-500/30' : 'bg-blue-500/20 text-blue-100 border border-blue-500/30'}`}>
                                {t.title}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs opacity-50 text-center py-4">No tasks</div>
                    )}
                </div>
            </div>
        </div>
    );
}
