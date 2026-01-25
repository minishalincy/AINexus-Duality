"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CalendarService, Reminder } from "@/services/calendar";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function CalendarWidget() {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newReminderText, setNewReminderText] = useState("");
    const [newReminderTime, setNewReminderTime] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Initial Fetch
    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        try {
            const data = await CalendarService.getReminders();
            setReminders(data);
        } catch (error) {
            console.error("Failed to load reminders", error);
        } finally {
            setLoading(false);
        }
    };

    // Calendar Logic
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Helper for safe local YYYY-MM-DD
    const formatDateKey = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Selection
    // Fix: Use helper instead of toISOString() which shifts timezones
    const formattedSelectedDate = formatDateKey(selectedDate);
    const selectedReminders = reminders.filter(r => r.date === formattedSelectedDate);

    // Add Reminder
    const handleAddReminder = async () => {
        if (!newReminderText.trim()) return;
        setIsSaving(true);
        try {
            const newReminder = await CalendarService.addReminder({
                date: formattedSelectedDate,
                text: newReminderText,
                time: newReminderTime || undefined
            });
            setReminders([...reminders, newReminder]);
            setNewReminderText("");
            setNewReminderTime("");
            setIsAdding(false);
        } catch (error) {
            console.error("Failed to add", error);
            alert("Failed to save reminder");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete Reminder
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this reminder?")) return;
        try {
            await CalendarService.deleteReminder(id);
            setReminders(reminders.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div className="bg-white/40 border border-white/60 rounded-3xl p-6 shadow-md h-full flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6">
            {/* Left: Calendar Grid */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4 bg-white/50 p-2 rounded-xl">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-lg cursor-pointer"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-primary-dark">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-lg cursor-pointer"><ChevronRight size={20} /></button>
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
                        const dObj = new Date(year, month, day);
                        // Local timezone safe date string construction for comparison
                        // (Simple approach: use YYYY-MM-DD from the loop)
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                        const isToday = new Date().toDateString() === dObj.toDateString();
                        const isSelected = selectedDate.toDateString() === dObj.toDateString();

                        const hasReminder = reminders.some(r => r.date === dateKey);

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dObj)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all cursor-pointer
                            ${isSelected ? "bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white shadow-md scale-105" : "hover:bg-gray-50 text-gray-700"}
                            ${isToday && !isSelected ? "border border-primary-500 text-primary-600 font-bold" : ""}
                        `}
                            >
                                {day}
                                {hasReminder && !isSelected && (
                                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right: Task List */}
            <div className="w-full md:w-48 lg:w-full xl:w-56 bg-gradient-to-br from-[#0e2e72] to-[#3498db] text-white border border-gray-100 rounded-2xl p-4 flex flex-col relative overflow-hidden shadow-sm">
                {/* Gradient Overlay removed for white theme */}

                <div className="flex items-center justify-between mb-4 z-10">
                    <div>
                        <span className="text-2xl font-bold block">{selectedDate.getDate()}</span>
                        <span className="text-sm opacity-80">{selectedDate.toLocaleString('default', { weekday: 'short' })}</span>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-white/20 text-white hover:bg-white/30 p-2 rounded-lg transition-colors cursor-pointer backdrop-blur-sm"
                    >
                        {isAdding ? <X size={18} /> : <Plus size={18} />}
                    </button>
                </div>

                {/* Add Input Area */}
                {isAdding && (
                    <div className="mb-4 animate-in slide-in-from-top-2 z-10 space-y-2">
                        <input
                            autoFocus
                            value={newReminderText}
                            onChange={(e) => setNewReminderText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReminder()}
                            placeholder={t('add_reminder') || "Add reminder..."}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20"
                        />
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newReminderTime}
                                onChange={(e) => setNewReminderTime(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:bg-white/20"
                            />
                            <button
                                onClick={handleAddReminder}
                                disabled={isSaving}
                                className="flex-1 bg-white text-[#0e2e72] text-xs font-bold py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="mb-2 z-10">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                        <Clock size={12} /> <span>{selectedReminders.length} {t('reminders') || "Reminders"}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar z-10">
                    {loading ? (
                        <div className="flex justify-center py-4"><Loader2 className="animate-spin opacity-50" /></div>
                    ) : selectedReminders.length > 0 ? (
                        selectedReminders.map((r) => (
                            <div key={r.id} className="group p-3 rounded-xl bg-white/10 border border-white/5 hover:bg-white/20 transition-colors text-sm flex justify-between items-start gap-2">
                                <div className="flex flex-col">
                                    <span className="text-white break-words">{r.text}</span>
                                    {r.time && <span className="text-xs text-white/70">{r.time}</span>}
                                </div>
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-white transition-opacity cursor-pointer"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    ) : (
                        !isAdding && <div className="text-xs opacity-50 text-center py-4">{t('no_tasks')}</div>
                    )}
                </div>
            </div>
        </div>
    );
}
