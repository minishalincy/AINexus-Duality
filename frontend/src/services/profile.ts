export interface TeacherProfile {
    id: string;
    name: string;
    email: string;
    school: string;
    profile_picture?: string;
    preferred_language: string;
}

export interface UpdateProfileDTO {
    name: string;
    profile_picture?: string;
}

const API_Base = "/api/teacher";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const ProfileService = {
    async getProfile(): Promise<TeacherProfile> {
        const res = await fetch(`${API_Base}/profile`, {
            headers: getHeaders()
        });
        if (!res.ok) {
            if (res.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to fetch profile");
        }
        return res.json();
    },

    async updateProfile(data: UpdateProfileDTO): Promise<TeacherProfile> {
        const res = await fetch(`${API_Base}/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            if (res.status === 401) throw new Error("Unauthorized");
            throw new Error("Failed to update profile");
        }
        return res.json();
    }
};
