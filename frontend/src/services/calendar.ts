
export interface Reminder {
    id: string;
    date: string; // YYYY-MM-DD
    text: string;
    teacher_email?: string;
}

export interface CreateReminderDTO {
    date: string;
    text: string;
}

const API_Base = "/api/calendar";

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

export const CalendarService = {
    async getReminders(): Promise<Reminder[]> {
        const res = await fetch(`${API_Base}/reminders`, {
            headers: getHeaders()
        });
        if (!res.ok) throw new Error("Failed to fetch reminders");
        return res.json();
    },

    async addReminder(data: CreateReminderDTO): Promise<Reminder> {
        const res = await fetch(`${API_Base}/reminders`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to add reminder");
        return res.json();
    },

    async deleteReminder(id: string): Promise<void> {
        const res = await fetch(`${API_Base}/reminders/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!res.ok) throw new Error("Failed to delete reminder");
    }
};
