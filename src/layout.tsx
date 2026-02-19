import { Sidebar } from '@/components/layout/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { PairingDialog } from '@/components/settings/PairingDialog';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

export function AppLayout() {
    const { sidebarOpen, setSidebarOpen } = useAppStore();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex h-full flex-col border-r transition-all duration-300",
                    sidebarOpen ? "w-80" : "w-0 overflow-hidden opacity-0"
                )}
            >
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-r w-80">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative h-full">
                {/* Toggle Sidebar Button (Desktop) */}
                <div className="absolute top-4 left-4 z-50 hidden md:block">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="opacity-50 hover:opacity-100"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <ChatArea />
            </main>

            {/* Pairing Dialog */}
            <PairingDialog />
        </div>
    );
}
