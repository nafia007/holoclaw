import { useState } from 'react';
import type { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const MOCK_CONVERSATIONS: Conversation[] = [
    { id: '1', title: 'Refactoring API', lastMessage: 'Can you structure the response like this?', timestamp: new Date(Date.now() - 1000 * 60 * 5), model: 'gpt-4o' },
    { id: '2', title: 'Learning Go', lastMessage: 'Channels in Go are like pipes...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), model: 'claude-3-5-sonnet' },
    { id: '3', title: 'Weekly Planning', lastMessage: 'Generate a summary for Monday...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), model: 'gpt-4o' },
];

export function Sidebar() {
    const { currentConversationId, setCurrentConversationId, setSettingsOpen } = useAppStore();
    const [search, setSearch] = useState("");
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

    const filtered = conversations.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleNewChat = async () => {
        const mockId = Date.now().toString();
        const newChat: Conversation = {
            id: mockId,
            title: "New Chat",
            lastMessage: "",
            timestamp: new Date(),
            model: "gpt-4o"
        };
        setConversations([newChat, ...conversations]);
        setCurrentConversationId(mockId);
    };

    return (
        <div className="flex flex-col h-full bg-sidebar-background border-r border-sidebar-border w-80 text-sidebar-foreground">
            <div className="p-4 space-y-4">
                <Button
                    className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    size="lg"
                    onClick={handleNewChat}
                >
                    <PlusCircle className="h-5 w-5" />
                    New Chat
                </Button>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        className="pl-9 bg-sidebar-accent/50 border-transparent focus:bg-background transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">RECENT</h3>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-1 pb-4">
                    {filtered.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setCurrentConversationId(chat.id)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg text-sm transition-all group relative overflow-hidden",
                                currentConversationId === chat.id
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-medium"
                                    : "hover:bg-sidebar-accent/50 text-foreground/80 hover:text-foreground"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="truncate pr-2">{chat.title}</span>
                                <span className="text-[10px] text-muted-foreground flex-shrink-0 opacity-70">
                                    {/* Simple time ago */}
                                    {timeAgo(chat.timestamp)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate opacity-80 group-hover:opacity-100 transition-opacity">
                                {chat.lastMessage || "No messages yet"}
                            </p>
                        </button>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border mt-auto">
                <button
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm font-medium"
                    onClick={() => setSettingsOpen(true)}
                >
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span>Settings</span>
                </button>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-sidebar-border/50">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-xs">
                        JD
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-medium">John Doe</span>
                        <span className="text-xs text-muted-foreground">Pro Plan</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}
