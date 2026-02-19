// Use proxy in development to avoid CORS issues
const API_BASE = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

export type Config = any; // Define properly based on backend config
export type Conversation = {
    key: string;
    summary?: string;
    updated: string;
    messages?: any[];
};

export const api = {
    getHealth: async (): Promise<any> => {
        const response = await fetch(`${API_BASE}/health`);
        if (!response.ok) {
            throw new Error(`Health check failed: ${response.statusText}`);
        }
        return await response.json();
    },

    sendMessage: async (message: string, bearerToken?: string): Promise<{ response: string; model: string }> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }

        const response = await fetch(`${API_BASE}/webhook`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
        }

        return await response.json();
    },

    pair: async (code: string): Promise<{ paired: boolean; token?: string; message?: string }> => {
        const response = await fetch(`${API_BASE}/pair`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pairing-Code': code,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: response.statusText }));
            throw new Error(errorData.error || `Pairing failed: ${response.statusText}`);
        }

        return await response.json();
    },

    getMetrics: async (): Promise<string> => {
        const response = await fetch(`${API_BASE}/metrics`);
        if (!response.ok) {
            throw new Error(`Metrics check failed: ${response.statusText}`);
        }
        return await response.text();
    }
};
