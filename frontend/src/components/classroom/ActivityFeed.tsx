
import { Clock } from "lucide-react";

export default function ActivityFeed() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Classroom Activity</h3>

            <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                {[
                    { title: "Homework Assigned", time: "2 hours ago", desc: "Chapter 2 exercises uploaded." },
                    { title: "Quiz Completed", time: "Yesterday", desc: "Average score: 85%" },
                    { title: "New Material Added", time: "2 days ago", desc: "PDF notes for Chapter 3." }
                ].map((item, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary-accent"></div>
                        <div>
                            <span className="text-xs font-bold text-primary-accent flex items-center gap-1 mb-1">
                                <Clock size={12} /> {item.time}
                            </span>
                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
