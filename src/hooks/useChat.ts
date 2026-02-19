import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Message } from '@/lib/types';
import { api } from '@/services/api';

export function useChat() {
    const { currentConversationId } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Welcome message when new chat is created
    useEffect(() => {
        if (currentConversationId && messages.length === 0) {
            const welcomeMessage: Message = {
                id: '1',
                role: 'assistant',
                content: "Hello! I'm ZeroClaw, your AI assistant. How can I help you today?",
                timestamp: new Date(),
            };

            setMessages([welcomeMessage]);
        }
    }, [currentConversationId]);

    const sendMessage = async (content: string) => {
        setError(null);
        setIsLoading(true);

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await api.sendMessage(content);
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
            setError(errorMsg);

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Error: ${errorMsg}`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, sendMessage, isLoading, error, setMessages };
}
