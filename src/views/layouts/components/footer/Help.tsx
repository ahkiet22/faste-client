import { Phone, Mail } from 'lucide-react';

export default function Help() {
  return (
    <div>
      <h4 className="font-semibold mb-4">Do You Need Help?</h4>
      <p className="text-sm text-muted-foreground">
        Autoseeker car, help desk always help you for create invoice.
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" />
          <span className="font-semibold">0 800 300-353</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" />
          <span>info@example.com</span>
        </div>
      </div>
    </div>
  );
}
