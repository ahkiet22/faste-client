"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function TransferPage() {
  const [step, setStep] = useState<"recipient" | "amount" | "confirm">("recipient")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [pin, setPin] = useState("")

  const recentContacts = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", avatar: "/diverse-user-avatars.png" },
    { id: 2, name: "John Doe", email: "john@example.com", avatar: "/diverse-user-avatars.png" },
    { id: 3, name: "Emily Chen", email: "emily@example.com", avatar: "/diverse-user-avatars.png" },
  ]

  const handleRecipientSubmit = () => {
    if (recipient) {
      setStep("amount")
    }
  }

  const handleAmountSubmit = () => {
    if (Number.parseFloat(amount) > 0) {
      setStep("confirm")
    }
  }

  const handleConfirm = () => {
    if (pin.length === 6) {
      alert("Transfer successful!")
      window.location.href = "/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Transfer Money</h1>
              <p className="text-sm text-muted-foreground">Send money to friends and family</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {["recipient", "amount", "confirm"].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["recipient", "amount", "confirm"].indexOf(step) > idx
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${["recipient", "amount", "confirm"].indexOf(step) > idx ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Recipient</span>
            <span>Amount</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Step 1: Recipient */}
        {step === "recipient" && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Select Recipient</CardTitle>
              <CardDescription>Who would you like to send money to?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Email, Phone, or Username</Label>
                <Input
                  id="recipient"
                  placeholder="Enter recipient details"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Recent Contacts</Label>
                <div className="space-y-2">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setRecipient(contact.email)}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                        recipient === contact.email ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                      {recipient === contact.email && (
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleRecipientSubmit} className="w-full" disabled={!recipient}>
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Amount */}
        {step === "amount" && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
              <CardDescription>How much would you like to send?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">$</span>
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
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="What's this for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer Amount</span>
                  <span className="font-medium">${Number.parseFloat(amount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer Fee</span>
                  <span className="font-medium text-accent">$0.00</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">${Number.parseFloat(amount || "0").toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("recipient")} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button
                  onClick={handleAmountSubmit}
                  className="flex-1"
                  disabled={!amount || Number.parseFloat(amount) <= 0}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <Card className="animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle>Confirm Transfer</CardTitle>
              <CardDescription>Review and confirm your transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Sending to</p>
                    <p className="text-sm text-muted-foreground">{recipient}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-xl">${Number.parseFloat(amount).toFixed(2)}</span>
                </div>

                {note && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Note</span>
                    <span className="font-medium max-w-[200px] text-right">{note}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transfer Fee</span>
                  <span className="font-medium text-accent">$0.00</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-xl">${Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">Enter PIN to Confirm</Label>
                <Input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("amount")} className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1" disabled={pin.length !== 6}>
                  Confirm Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
