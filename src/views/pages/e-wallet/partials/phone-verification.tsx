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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PhoneVerificationProps {
  onNext: () => void;
  updateData: (data: any) => void;
  data: any;
}

export function PhoneVerification({
  onNext,
  updateData,
  data,
}: PhoneVerificationProps) {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState(data.phone || '');
  const [email, setEmail] = useState(data.email || '');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    // Simulate sending verification code
    setCodeSent(true);
  };

  const handleVerify = () => {
    if (code.length === 6) {
      updateData({ phone, email });
      onNext();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
        <CardDescription>
          Choose your preferred verification method to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={method}
          onValueChange={(v) => setMethod(v as 'phone' | 'email')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">Phone Number</TabsTrigger>
            <TabsTrigger value="email">Email Address</TabsTrigger>
          </TabsList>

          <TabsContent value="phone" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={codeSent}
                />
                {!codeSent && (
                  <Button onClick={handleSendCode} variant="outline">
                    Send Code
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={codeSent}
                />
                {!codeSent && (
                  <Button onClick={handleSendCode} variant="outline">
                    Send Code
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {codeSent && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-sm text-muted-foreground">
                We sent a verification code to{' '}
                {method === 'phone' ? phone : email}
              </p>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={code.length !== 6}
            >
              Verify & Continue
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setCodeSent(false)}
            >
              Resend Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
