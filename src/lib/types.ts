export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: Attachment[];
};

export type Attachment = {
    type: 'image' | 'file' | 'code';
    url: string;
    name: string;
};

export type Conversation = {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    model: string;
};

export type Config = {
    agents: {
        defaults: {
            model: string;
            max_tokens: number;
            temperature: number;
            max_tool_iterations: number;
            workspace: string;
        }
    };
    heartbeat: {
        enabled: boolean;
        interval: number;
    };
};
