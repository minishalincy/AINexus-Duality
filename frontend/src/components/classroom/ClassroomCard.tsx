
import { GraduationCap, Trash2 } from "lucide-react";

interface ClassroomCardProps {
    grade: string;
    section: string;
    subject: string;
    isSelected: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

export default function ClassroomCard({ grade, section, subject, isSelected, onClick, onDelete }: ClassroomCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                relative min-w-50 p-6 rounded-2xl cursor-pointer transition-all duration-300
                flex flex-col items-center justify-center gap-3 border group
                ${isSelected
                    ? 'bg-white border-primary-accent shadow-lg scale-105 z-10'
                    : 'bg-white/80 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md'
                }
            `}
        >
            {isSelected && (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-accent rounded-t-2xl"></div>
            )}
            
            {onDelete && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Class"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-colors
                ${isSelected ? 'bg-primary-50 text-primary-accent' : 'bg-gray-100 text-gray-500'}
            `}>
                <GraduationCap size={24} />
            </div>

            <div className="text-center">
                <h3 className={`text-lg font-bold ${isSelected ? 'text-primary-dark' : 'text-gray-700'}`}>
                    Class {grade}-{section}
                </h3>
                <p className={`text-sm font-medium ${isSelected ? 'text-primary-accent' : 'text-gray-500'}`}>
                    {subject}
                </p>
            </div>
        </div>
    );
}
