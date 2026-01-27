import { toast } from "sonner";
import { getUserMessage } from "./error-map";

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string; // We ignore this message in UI logic as per rule, but it's there.
    };
    message?: string; // Sometimes success message in top level or inside? The backend sends { success: true, message, data } OR { success: false, error: { code, message } }
}

export async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T | null> {
    try {
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        const json: ApiResponse<T> = await res.json();

        if (!json.success && json.error) {
            const userMessage = getUserMessage(json.error.code);
            toast.error(userMessage); // Use error variant
            return null;
        }

        if (json.success && json.message && options.method && options.method !== "GET") {
             toast.success(json.message); // Use success variant
        }

        return json.data as T;

    } catch (err) {
        toast.error("Failed to connect to the server.");
        return null;
    }
}
