/* eslint-disable react/no-unescaped-entities */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RegistrationCompleteProps {
  data: any;
}

export function RegistrationComplete({ data }: RegistrationCompleteProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-accent-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl">Registration Complete!</CardTitle>
        <CardDescription>
          Your E-wallet account has been successfully created
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contact:</span>
            <span className="font-medium">{data.phone || data.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account Status:</span>
            <span className="font-medium text-accent">Verified</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Security:</span>
            <span className="font-medium">PIN Enabled</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">What's Next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Add funds to your wallet to start shopping</span>
            </li>
            <li className="flex items-start gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Explore exclusive deals and cashback offers</span>
            </li>
            <li className="flex items-start gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Send money to friends and family instantly</span>
            </li>
          </ul>
        </div>

        <Link href="/dashboard" className="block">
          <Button className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
