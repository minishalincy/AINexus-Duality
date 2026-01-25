
export interface FeedbackAnalysis {
    good_things: string;
    bad_things: string;
    improvement: string;
}

export interface FeedbackItem {
    id: string;
    date: string;
    preview: string;
    type: string;
    full_text: string;
    language: string;
    analysis: FeedbackAnalysis;
    effectiveness?: "yes" | "no";
}

const API_BASE = "/api/feedback";

const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
        "Authorization": `Bearer ${token}`
    };
};

export const FeedbackService = {
    async getList(): Promise<FeedbackItem[]> {
        const res = await fetch(`${API_BASE}/list`, {
            headers: { ...getHeaders(), "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("Failed to fetch feedback");
        return res.json();
    },

    async analyze(text: string, language: string, feedbackId?: string): Promise<FeedbackItem> {
        const formData = new FormData();
        formData.append("message", text);
        formData.append("language", language);
        if (feedbackId) {
            formData.append("feedback_id", feedbackId);
        }

        const res = await fetch(`${API_BASE}/analyze`, {
            method: "POST",
            headers: getHeaders(), // No Content-Type for FormData
            body: formData
        });
        if (!res.ok) {
            const err = await res.text();
            console.error("Analysis Error:", res.status, err);
            throw new Error(`Analysis failed: ${res.status} ${err}`);
        }
        return res.json();
    },

    async rate(id: string, successful: boolean): Promise<void> {
        const res = await fetch(`${API_BASE}/${id}/rate`, {
            method: "PATCH",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ successful })
        });
        if (!res.ok) throw new Error("Failed to save rating");
    }
};
