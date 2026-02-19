import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    currentConversationId: string | null;
    setCurrentConversationId: (id: string | null) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    settingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    // Authentication
    bearerToken: string | null;
    setBearerToken: (token: string | null) => void;
    isPaired: boolean;
    setIsPaired: (paired: boolean) => void;
    pairingDialogOpen: boolean;
    setPairingDialogOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            currentConversationId: null,
            setCurrentConversationId: (id) => set({ currentConversationId: id }),
            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            settingsOpen: false,
            setSettingsOpen: (open) => set({ settingsOpen: open }),
            theme: 'dark', // Default to dark as per PRD "Dark Mode"
            setTheme: (theme) => set({ theme }),
            // Authentication
            bearerToken: null,
            setBearerToken: (token) => set({ bearerToken: token }),
            isPaired: false,
            setIsPaired: (paired) => set({ isPaired: paired }),
            pairingDialogOpen: false,
            setPairingDialogOpen: (open) => set({ pairingDialogOpen: open }),
        }),
        {
            name: 'zeroclaw-storage',
            partialize: (state) => ({
                bearerToken: state.bearerToken,
                isPaired: state.isPaired,
                theme: state.theme,
            }),
        }
    )
);
