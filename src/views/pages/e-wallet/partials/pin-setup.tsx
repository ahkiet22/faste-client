/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PinSetupProps {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: any) => void;
  data: any;
}

export function PinSetup({ onNext, onBack, updateData }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    updateData({ pin });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Security PIN</CardTitle>
        <CardDescription>
          Set up a 6-digit PIN to secure your wallet transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Create PIN</Label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              placeholder="Enter 6-digit PIN"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="text-center text-2xl tracking-widest font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              placeholder="Re-enter PIN"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value.replace(/\D/g, ''));
                setError('');
              }}
              className="text-center text-2xl tracking-widest font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-2">
              {error}
            </p>
          )}
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">PIN Security Tips:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Use a unique combination that's easy to remember</li>
            <li>Avoid sequential numbers like 123456</li>
            <li>Don't use your birthday or phone number</li>
            <li>Never share your PIN with anyone</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 bg-transparent"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            disabled={pin.length !== 6 || confirmPin.length !== 6}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
