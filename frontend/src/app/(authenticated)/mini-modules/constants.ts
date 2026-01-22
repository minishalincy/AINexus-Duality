export type TeacherCategory =
    | 'classroom-management'
    | 'time-management'
    | 'stress-burnout'
    | 'teaching-improvement'
    | 'reflection'
    | 'skills-management';

export type GradeLevel = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6' | 'grade7' | 'grade8';

export const TEACHER_CATEGORIES: { key: TeacherCategory; label: string }[] = [
    { key: 'classroom-management', label: 'Classroom Management' },
    { key: 'time-management', label: 'Time Management' },
    { key: 'stress-burnout', label: 'Stress & Burnout' },
    { key: 'teaching-improvement', label: 'Teaching Improvement' },
    { key: 'reflection', label: 'Reflection' },
    { key: 'skills-management', label: 'Skills Management' },
];

export const GRADES: { key: GradeLevel; label: string; number: number }[] = [
    { key: 'grade1', label: 'Grade 1', number: 1 },
    { key: 'grade2', label: 'Grade 2', number: 2 },
    { key: 'grade3', label: 'Grade 3', number: 3 },
    { key: 'grade4', label: 'Grade 4', number: 4 },
    { key: 'grade5', label: 'Grade 5', number: 5 },
    { key: 'grade6', label: 'Grade 6', number: 6 },
    { key: 'grade7', label: 'Grade 7', number: 7 },
    { key: 'grade8', label: 'Grade 8', number: 8 },
];

// Video metadata interface
export interface VideoMeta {
    id: string;
    titleKey: string; // Key for translation
    filename: string;
}

// Map categories to video lists
export const TEACHER_VIDEO_DATA: Record<TeacherCategory, VideoMeta[]> = {
    'classroom-management': [
        { id: 'classroom-management', titleKey: 'classroom_management_video', filename: 'classroom_management.mp4' }
    ],
    'time-management': [
        { id: 'time-management', titleKey: 'time_management_video', filename: 'time_management.mp4' }
    ],
    'stress-burnout': [
        { id: 'stress-burnout', titleKey: 'stress_burnout_video', filename: 'stress_burnout.mp4' }
    ],
    'teaching-improvement': [
        { id: 'teaching-improvement', titleKey: 'teaching_improvement_video', filename: 'teaching_improvement.mp4' }
    ],
    'reflection': [
        { id: 'skills-management-ref', titleKey: 'skills_management_video', filename: 'skills_management.mp4' } // Based on file finding
    ],
    'skills-management': [
        { id: 'skills-management', titleKey: 'skills_management_video', filename: 'skills_management.mp4' }
    ],
};

// Map grades to video lists
export const GRADE_VIDEO_DATA: Record<GradeLevel, VideoMeta[]> = {
    'grade1': [
        { id: 'basic-shapes', titleKey: 'basic_shapes', filename: 'basic_shapes.mp4' },
        { id: 'counting-numbers', titleKey: 'counting_numbers', filename: 'counting_numbers.mp4' }
    ],
    'grade2': [
        { id: 'addition-subtraction', titleKey: 'addition_subtraction', filename: 'addition_subtraction.mp4' },
        { id: 'telling-time', titleKey: 'telling_time', filename: 'telling_time.mp4' }
    ],
    'grade3': [
        { id: 'fraction', titleKey: 'fraction', filename: 'fraction.mp4' },
        { id: 'multiplication', titleKey: 'multiplication', filename: 'multiplication.mp4' }
    ],
    'grade4': [
        { id: 'division', titleKey: 'division', filename: 'division.mp4' },
        { id: 'math-word', titleKey: 'math_word', filename: 'math_word.mp4' }
    ],
    'grade5': [
        { id: 'factors', titleKey: 'factors', filename: 'factors.mp4' },
        { id: 'fraction-decimals', titleKey: 'fraction_decimals', filename: 'fraction_decimals.mp4' }
    ],
    'grade6': [
        { id: 'integers', titleKey: 'integers', filename: 'integers.mp4' },
        { id: 'ratios', titleKey: 'rations', filename: 'rations.mp4' } // Filename is rations.mp4
    ],
    'grade7': [
        { id: 'algebra', titleKey: 'algebra', filename: 'algebra.mp4' },
        { id: 'lines-angles', titleKey: 'lines_angles', filename: 'lines_angles.mp4' }
    ],
    'grade8': [
        { id: 'area-volume', titleKey: 'area_volume', filename: 'area_volume.mp4' },
        { id: 'linear-equations', titleKey: 'linearequations', filename: 'linearequations.mp4' }
    ],
};

// Helper to find video path
export const getGradeVideoPath = (grade: GradeLevel, filename: string) => `/videos/grade-wise/${grade}/${filename}`;
export const getTeacherVideoPath = (category: TeacherCategory, filename: string) => `/videos/teacher/${category}/${filename}`;
