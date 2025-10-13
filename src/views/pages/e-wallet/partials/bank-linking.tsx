"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BankLinkingProps {
  onNext: () => void
  onBack: () => void
  updateData: (data: any) => void
  data: any
}

export function BankLinking({ onNext, onBack, updateData }: BankLinkingProps) {
  const [bankAccount, setBankAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    routingNumber: "",
  })

  const handleSubmit = () => {
    updateData({ bankAccount })
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Link Your Bank Account</CardTitle>
        <CardDescription>Connect your bank account to easily add funds to your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select
              value={bankAccount.bankName}
              onValueChange={(value) => setBankAccount({ ...bankAccount, bankName: value })}
            >
              <SelectTrigger id="bankName">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chase">Chase Bank</SelectItem>
                <SelectItem value="bofa">Bank of America</SelectItem>
                <SelectItem value="wells">Wells Fargo</SelectItem>
                <SelectItem value="citi">Citibank</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Holder Name</Label>
            <Input
              id="accountName"
              placeholder="John Doe"
              value={bankAccount.accountName}
              onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="1234567890"
                value={bankAccount.accountNumber}
                onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                type="text"
                placeholder="021000021"
                value={bankAccount.routingNumber}
                onChange={(e) => setBankAccount({ ...bankAccount, routingNumber: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-medium">Your information is secure</p>
              <p className="text-xs text-muted-foreground">
                We use bank-level encryption to protect your financial data. Your account details are never shared with
                third parties.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Complete Setup
          </Button>
        </div>

        <Button variant="ghost" className="w-full" onClick={handleSubmit}>
          Skip for now
        </Button>
      </CardContent>
    </Card>
  )
}
