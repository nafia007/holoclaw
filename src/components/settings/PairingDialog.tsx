import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';
import { api } from '@/services/api';
import { Loader2, Key, CheckCircle, AlertCircle } from 'lucide-react';

export function PairingDialog() {
    const { pairingDialogOpen, setPairingDialogOpen, setBearerToken, setIsPaired } = useAppStore();
    const [pairingCode, setPairingCode] = useState('');
    const [bearerTokenInput, setBearerTokenInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mode, setMode] = useState<'code' | 'token'>('code');

    const handlePair = async () => {
        if (!pairingCode.trim()) {
            setError('Please enter a pairing code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await api.pair(pairingCode.trim());
            if (result.paired && result.token) {
                setBearerToken(result.token);
                setIsPaired(true);
                setSuccess(true);
                setTimeout(() => {
                    setPairingDialogOpen(false);
                    setSuccess(false);
                    setPairingCode('');
                }, 1500);
            } else {
                setError(result.message || 'Pairing failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to pair');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTokenSubmit = () => {
        if (!bearerTokenInput.trim()) {
            setError('Please enter a bearer token');
            return;
        }

        setBearerToken(bearerTokenInput.trim());
        setIsPaired(true);
        setSuccess(true);
        setTimeout(() => {
            setPairingDialogOpen(false);
            setSuccess(false);
            setBearerTokenInput('');
        }, 1500);
    };

    return (
        <Dialog open={pairingDialogOpen} onOpenChange={setPairingDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Pair with ZeroClaw Gateway
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'code'
                            ? 'Enter the 6-digit pairing code displayed in your ZeroClaw gateway terminal.'
                            : 'Enter an existing bearer token to authenticate.'}
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <p className="text-lg font-medium text-green-500">Successfully paired!</p>
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {/* Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={mode === 'code' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => { setMode('code'); setError(null); }}
                                className="flex-1"
                            >
                                Pairing Code
                            </Button>
                            <Button
                                variant={mode === 'token' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => { setMode('token'); setError(null); }}
                                className="flex-1"
                            >
                                Bearer Token
                            </Button>
                        </div>

                        {mode === 'code' ? (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="pairing-code">Pairing Code</Label>
                                    <Input
                                        id="pairing-code"
                                        placeholder="Enter 6-digit code"
                                        value={pairingCode}
                                        onChange={(e) => setPairingCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handlePair()}
                                        maxLength={6}
                                        className="text-center text-2xl tracking-widest font-mono"
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-destructive text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Button onClick={handlePair} disabled={isLoading || !pairingCode.trim()}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Pairing...
                                        </>
                                    ) : (
                                        'Pair Device'
                                    )}
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Run <code className="bg-muted px-1 py-0.5 rounded">zeroclaw gateway</code> to see the pairing code.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="bearer-token">Bearer Token</Label>
                                    <Input
                                        id="bearer-token"
                                        placeholder="zc_..."
                                        value={bearerTokenInput}
                                        onChange={(e) => setBearerTokenInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
                                        className="font-mono text-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-destructive text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Button onClick={handleTokenSubmit} disabled={!bearerTokenInput.trim()}>
                                    Save Token
                                </Button>

                                <p className="text-xs text-muted-foreground text-center">
                                    Use an existing token from a previous pairing session.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
