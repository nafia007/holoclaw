import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Send, Image, FileText, Bot, User, Loader2, Key, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useChat } from '@/hooks/useChat';

export function ChatArea() {
    const { currentConversationId, isPaired, setPairingDialogOpen } = useAppStore();
    const { messages, sendMessage, isLoading } = useChat();
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
    };

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const formatTime = (date: Date) => {
        try {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    if (!currentConversationId) {
        return (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center p-8 bg-background">
                <Bot className="h-16 w-16 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-semibold">Select a conversation</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                    Choose an existing chat from the sidebar or start a new one to begin interacting with ZeroClaw.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background relative">
            <header className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="flex flex-col">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        ZeroClaw Assistant
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">v1.0</span>
                    </h2>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        Using ZeroClaw Gateway
                        <span
                            className={cn(
                                "w-2 h-2 rounded-full ml-2",
                                isPaired ? "bg-green-500" : "bg-yellow-500"
                            )}
                            title={isPaired ? "Connected & Paired" : "Not Paired"}
                        />
                    </span>
                </div>
                <div className="flex gap-2">
                    {isPaired ? (
                        <Button variant="ghost" size="sm" className="text-green-500 gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Paired
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPairingDialogOpen(true)}
                            className="gap-1"
                        >
                            <Key className="h-4 w-4" />
                            Pair
                        </Button>
                    )}
                </div>
            </header>

            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-6 max-w-3xl mx-auto pb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={cn(
                                "flex gap-4 w-full",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "relative max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-muted text-foreground rounded-bl-none border border-border/50"
                                )}
                            >
                                <div className="mb-1 text-[10px] opacity-50 font-medium uppercase tracking-wider flex justify-between gap-4">
                                    <span>{msg.role}</span>
                                    <span>{formatTime(msg.timestamp)}</span>
                                </div>
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-invert prose-sm max-w-none dark:prose-invert">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                code(props) {
                                                    const { children, className, ...rest } = props
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return match ? (
                                                        <div className="rounded-md overflow-hidden my-2 bg-black/50 border border-white/10">
                                                            <div className="bg-white/5 px-3 py-1 text-xs text-muted-foreground border-b border-white/5 flex justify-between">
                                                                <span>{match[1]}</span>
                                                            </div>
                                                            <div className="p-3 overflow-x-auto text-xs font-mono">
                                                                <code className={className} {...rest}>
                                                                    {children}
                                                                </code>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-black/20 px-1 py-0.5 rounded font-mono text-xs" {...rest}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="h-5 w-5 text-secondary-foreground" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background/95 backdrop-blur">
                <div className="max-w-3xl mx-auto relative flex gap-2 items-end">
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full">
                        <Image className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <div className="relative flex-1">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Message ZeroClaw..."
                            className="pr-12 min-h-[44px] py-3 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-input shadow-inner resize-none transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            size="icon"
                            className={cn(
                                "absolute right-1 top-1 h-9 w-9 rounded-full transition-all",
                                input.trim() && !isLoading ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:bg-muted"
                            )}
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-muted-foreground">ZeroClaw can make mistakes. Check important info.</span>
                </div>
            </div>
        </div>
    );
}
