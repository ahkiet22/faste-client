"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Zap } from "lucide-react"
import { usePaymentState } from "@/hooks/use-payment-state"
import { validateAmount } from "@/lib/payment-validation"
import { ERROR_CODES } from "@/lib/error-handler"

interface PayfastPaymentProps {
  amount: number
  disabled: boolean
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PayfastPayment({ amount, disabled, onSuccess, onError }: PayfastPaymentProps) {
  const [walletBalance, setWalletBalance] = useState(250.0)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [showTopUp, setShowTopUp] = useState(false)
  const paymentState = usePaymentState()

  const amountValidation = validateAmount(amount)
  const hasInsufficientBalance = walletBalance < amount

  const handleTopUp = async () => {
    const topUpValue = Number.parseFloat(topUpAmount)

    const topUpValidation = validateAmount(topUpValue)
    if (!topUpValidation.valid) {
      onError(ERROR_CODES.INVALID_AMOUNT)
      return
    }

    paymentState.setProcessing()
    try {
      // Simulate top-up processing
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setWalletBalance((prev) => prev + topUpValue)
      setTopUpAmount("")
      setShowTopUp(false)
      paymentState.setSuccess()
    } catch (error) {
      const errorCode = ERROR_CODES.TRANSACTION_FAILED
      onError(errorCode)
      paymentState.setError(errorCode, "Top-up failed. Please try again.")
    }
  }

  const handlePayNow = async () => {
    if (!amountValidation.valid) {
      onError(ERROR_CODES.INVALID_AMOUNT)
      return
    }

    if (walletBalance < amount) {
      onError(ERROR_CODES.INSUFFICIENT_BALANCE)
      return
    }

    paymentState.setProcessing()
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setWalletBalance((prev) => prev - amount)
      onSuccess()
      paymentState.setSuccess()
    } catch (error) {
      const errorCode = ERROR_CODES.TRANSACTION_FAILED
      onError(errorCode)
      paymentState.setError(errorCode, "Payment failed. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-lg border border-orange-200 dark:border-orange-800">
        <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">Current Wallet Balance</p>
        <p className="text-4xl font-bold text-orange-900 dark:text-orange-100 mb-4">USD {walletBalance.toFixed(2)}</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-white dark:bg-slate-900 rounded p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Amount Required</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">USD {amount.toFixed(2)}</p>
          </div>
          <div className="flex-1 bg-white dark:bg-slate-900 rounded p-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Remaining</p>
            <p
              className={`text-lg font-semibold ${walletBalance - amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              USD {Math.max(0, walletBalance - amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Insufficient Balance Alert */}
      {hasInsufficientBalance && (
        <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200 ml-2">
            Insufficient balance. You need USD {(amount - walletBalance).toFixed(2)} more to complete this payment.
          </AlertDescription>
        </Alert>
      )}

      {/* Top-Up Section */}
      {showTopUp ? (
        <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div>
            <Label htmlFor="topup-amount" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Top-Up Amount (USD)
            </Label>
            <Input
              id="topup-amount"
              type="number"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              disabled={disabled || paymentState.status === "processing"}
              className="mt-2"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleTopUp}
              disabled={disabled || paymentState.status === "processing" || !topUpAmount}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto"
              size="lg"
            >
              {paymentState.status === "processing" ? "Processing..." : "Confirm Top-Up"}
            </Button>
            <Button
              onClick={() => {
                setShowTopUp(false)
                setTopUpAmount("")
              }}
              disabled={disabled || paymentState.status === "processing"}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          {hasInsufficientBalance ? (
            <Button
              onClick={() => setShowTopUp(true)}
              disabled={disabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-auto"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Top Up Wallet
            </Button>
          ) : (
            <Button
              onClick={handlePayNow}
              disabled={disabled || paymentState.status === "processing"}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-auto"
              size="lg"
            >
              {paymentState.status === "processing" ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </div>
      )}

      {/* Info Alert */}
      <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
          PayFast is our internal wallet system. Funds are deducted instantly upon payment confirmation.
        </AlertDescription>
      </Alert>
    </div>
  )
}
