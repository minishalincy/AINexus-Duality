
import { queueRequest, removeRequestByTempId } from '@/lib/offline-sync';

export interface Classroom {
    id: string;
    grade: string;
    section: string;
    subject: string;
    completed_chapters: number[];
}

export interface CreateClassroomDTO {
    grade: string;
    section: string;
    subject: string;
}

const API_Base = "/api/dashboard"; // Relative path to use proxy

const getHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No auth token found in localStorage");
        throw new Error("Unauthorized: No token found");
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

const isOffline = () => {
    return typeof navigator !== 'undefined' && !navigator.onLine;
};

export const ClassroomService = {
    async getClassrooms(): Promise<Classroom[]> {
        // GET requests are handled by Service Worker caching (NetworkFirst/StaleWhileRevalidate)
        const res = await fetch(`${API_Base}/subjects`, {
            headers: getHeaders()
        });
        if (!res.ok) {
            if (res.status === 401) throw new Error("Unauthorized");
            throw new Error(`Failed to fetch classrooms: ${res.status} ${res.statusText}`);
        }
        try {
            const text = await res.text();
            return text ? JSON.parse(text) : [];
        } catch (error: unknown) {
            console.error("Failed to parse classrooms JSON", error);
            return [];
        }
    },

    async addClassroom(data: CreateClassroomDTO): Promise<Classroom> {
        const url = `${API_Base}/subjects`;
        const headers = getHeaders();

        try {
            if (isOffline()) throw new Error("Offline");

            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                 if (res.status === 401) throw new Error("Unauthorized");
                 throw new Error("Failed to add classroom");
            }
            return res.json();
        } catch (error: unknown) {
            const err = error as Error;
            if (isOffline() || err.message === "Offline" || err.message?.includes("Failed to fetch")) {
                console.log("Offline mode: Queueing addClassroom");
                const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
                await queueRequest(url, "POST", data, headers, tempId);
                // Return optimistic result
                return {
                    id: tempId,
                    ...data,
                    completed_chapters: []
                };
            }
            throw error;
        }
    },

    async deleteClassroom(id: string): Promise<void> {
        if (id.startsWith('temp-')) {
            await removeRequestByTempId(id);
            return;
        }

        const url = `${API_Base}/subjects/${id}`;
        const headers = getHeaders();

        try {
            if (isOffline()) throw new Error("Offline");

            const res = await fetch(url, {
                method: "DELETE",
                headers
            });
            if (!res.ok) {
                 if (res.status === 401) throw new Error("Unauthorized");
                 throw new Error("Failed to delete classroom");
            }
        } catch (error: unknown) {
            const err = error as Error;
            if (isOffline() || err.message === "Offline" || err.message?.includes("Failed to fetch")) {
                console.log("Offline mode: Queueing deleteClassroom");
                await queueRequest(url, "DELETE", {}, headers);
                return;
            }
            throw error;
        }
    },

    async updateProgress(id: string, chapters: number[]): Promise<void> {
        const url = `${API_Base}/subjects/${id}/progress`;
        const headers = getHeaders();

        try {
            if (isOffline()) throw new Error("Offline");

            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(chapters),
            });
            if (!res.ok) throw new Error("Failed to update progress");
        } catch (error: unknown) {
            const err = error as Error;
            if (isOffline() || err.message === "Offline" || err.message?.includes("Failed to fetch")) {
                console.log("Offline mode: Queueing updateProgress");
                await queueRequest(url, "POST", chapters, headers);
                return;
            }
            throw error;
        }
    }
};
