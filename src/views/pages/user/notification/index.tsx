'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState({
    transactions: true,
    promotions: false,
    security: true,
    newsletter: false,
  });
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Transaction Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified about all transactions
              </p>
            </div>
            <Switch
              checked={notifications.transactions}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, transactions: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">
                Important security updates and warnings
              </p>
            </div>
            <Switch
              checked={notifications.security}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, security: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Promotions & Offers</p>
              <p className="text-sm text-muted-foreground">
                Special deals and cashback opportunities
              </p>
            </div>
            <Switch
              checked={notifications.promotions}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, promotions: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Newsletter</p>
              <p className="text-sm text-muted-foreground">
                Monthly updates and tips
              </p>
            </div>
            <Switch
              checked={notifications.newsletter}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, newsletter: checked })
              }
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
