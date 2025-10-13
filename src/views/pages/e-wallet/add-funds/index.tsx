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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function AddFundsPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [step, setStep] = useState<'amount' | 'method' | 'confirm'>('amount');

  const quickAmounts = [50, 100, 200, 500];

  const handleAmountSubmit = () => {
    if (Number.parseFloat(amount) > 0) {
      setStep('method');
    }
  };

  const handleMethodSubmit = () => {
    setStep('confirm');
  };

  const handleConfirm = () => {
    // Process payment
    alert('Funds added successfully!');
    window.location.href = '/e-wallet';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Add Funds</h1>
              <p className="text-sm text-muted-foreground">
                Top up your wallet balance
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['amount', 'method', 'confirm'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['amount', 'method', 'confirm'].indexOf(step) > idx
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${['amount', 'method', 'confirm'].indexOf(step) > idx ? 'bg-primary' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Amount</span>
            <span>Payment Method</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Step 1: Amount */}
        {step === 'amount' && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
              <CardDescription>
                How much would you like to add to your wallet?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl pl-8 h-14"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      onClick={() => setAmount(amt.toString())}
                      className={
                        amount === amt.toString()
                          ? 'border-primary bg-primary/5'
                          : 'bg-transparent'
                      }
                    >
                      ${amt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    ${Number.parseFloat(amount || '0').toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium text-accent">$0.00</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      ${Number.parseFloat(amount || '0').toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAmountSubmit}
                className="w-full"
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment Method */}
        {step === 'method' && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>
                Choose how you'd like to add funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>

                <TabsContent value="bank" className="space-y-4 mt-6">
                  <RadioGroup defaultValue="linked-bank">
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="linked-bank" id="linked-bank" />
                      <Label
                        htmlFor="linked-bank"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Chase Bank ****1234</p>
                            <p className="text-sm text-muted-foreground">
                              Checking Account
                            </p>
                          </div>
                          <svg
                            className="w-8 h-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="new-bank" id="new-bank" />
                      <Label
                        htmlFor="new-bank"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <span className="font-medium">
                            Add New Bank Account
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="crypto" className="space-y-4 mt-6">
                  <RadioGroup defaultValue="btc">
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="btc" id="btc" />
                      <Label htmlFor="btc" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Bitcoin (BTC)</p>
                            <p className="text-sm text-muted-foreground">
                              Network fee: ~$2.50
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="eth" id="eth" />
                      <Label htmlFor="eth" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Ethereum (ETH)</p>
                            <p className="text-sm text-muted-foreground">
                              Network fee: ~$1.80
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="usdt" id="usdt" />
                      <Label htmlFor="usdt" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Tether (USDT)</p>
                            <p className="text-sm text-muted-foreground">
                              Network fee: ~$1.00
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('amount')}
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button onClick={handleMethodSubmit} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Confirm Transaction</CardTitle>
              <CardDescription>Review your transaction details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-xl">
                    ${Number.parseFloat(amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">
                    {paymentMethod === 'bank'
                      ? 'Chase Bank ****1234'
                      : paymentMethod === 'card'
                        ? 'Credit Card'
                        : 'Cryptocurrency'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium text-accent">$0.00</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-semibold text-xl">
                      ${Number.parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Transaction will be processed instantly
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Funds will be available in your wallet immediately after
                      confirmation
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('method')}
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Confirm & Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
