import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Newsletter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Join our newsletter for £10 offs
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Register now to get latest updates on promotions & coupons. We do not
          spam.
        </p>
      </div>

      <div>
        <div className="flex gap-2">
          <Input placeholder="Enter your email address" />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            SEND
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          By subscribing, you agree to our{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-purple-600 hover:underline">
            Privacy & Cookies Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
