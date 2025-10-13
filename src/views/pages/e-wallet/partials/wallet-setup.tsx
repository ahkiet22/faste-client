import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WalletSetUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-primary-foreground"
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
          <h1 className="text-4xl font-bold text-balance">
            Welcome to E-Wallet
          </h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Your secure digital wallet for seamless e-commerce transactions
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link href="/e-wallet/register" className="block">
            <Button size="lg" className="w-full">
              Create Account
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-transparent"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="pt-8 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">Secure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">0%</div>
              <div className="text-xs text-muted-foreground">Fees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
