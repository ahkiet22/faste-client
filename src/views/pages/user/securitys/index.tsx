'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { VerificationCodeTypeType } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import {
  disableTwoFactorAuth,
  enableTwoFactorAuth,
  getDevices,
  sendOTP,
} from '@/services/auth.service';
import { getProfile } from '@/services/profile.service';
import { TDevice } from '@/types/auth';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { toastify } from '@/components/ToastNotification';
import { useTranslation } from 'react-i18next';

export const SecurityPage = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [devices, setDevices] = useState<TDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [isSendingEmailOTP, setIsSendingEmailOTP] = useState(false);

  const fetchInitialData = async () => {
    try {
      const [devicesRes, profileRes] = await Promise.all([
        getDevices(),
        getProfile(),
      ]);

      const deviceData = (devicesRes as any).data || devicesRes;
      setDevices(Array.isArray(deviceData) ? deviceData : []);

      if (profileRes.data) {
        setUser(profileRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch security data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle2FA = async (checked: boolean) => {
    if (is2FALoading) return;

    if (checked) {
      setIs2FALoading(true);
      try {
        const res = await enableTwoFactorAuth();
        if (res.uri) {
          setQrCodeUri(res.uri);
          setShowQRDialog(true);
        }
      } catch (error: any) {
        toastify.error(
          t('security.2fa.title'),
          error.response?.data?.message || t('security.2fa.enableFailed'),
        );
      } finally {
        setIs2FALoading(false);
      }
    } else {
      if (!user?.email) {
        toastify.error(t('security.error'), t('security.emailNotFound'));
        return;
      }
      setShowOTPDialog(true);
    }
  };

  const handleVerifyDisable = async () => {
    if (otpCode.length < 6) {
      toastify.error(t('security.error'), t('security.otp.invalidCode'));
      return;
    }

    setIsSubmittingOTP(true);
    try {
      await disableTwoFactorAuth({ totpCode: otpCode });
      toastify.success(t('security.success'), t('security.2fa.disabledSuccess'));
      setShowOTPDialog(false);
      setOtpCode('');
      setIsEmailMode(false);
      const profileRes = await getProfile();
      if (profileRes.data) {
        setUser(profileRes.data);
      }
    } catch (error: any) {
      toastify.error(
        t('security.error'),
        error.response?.data?.message || t('security.otp.verifyFailed'),
      );
    } finally {
      setIsSubmittingOTP(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!user?.email) return;

    setIsSendingEmailOTP(true);
    try {
      await sendOTP({
        email: user.email,
        type: VerificationCodeTypeType.DISABLE_2FA,
      });
      setIsEmailMode(true);
      toastify.success(t('security.success'), t('security.otp.emailSent'));
    } catch (error: any) {
      toastify.error(
        t('security.error'),
        error.response?.data?.message || t('security.otp.sendFailed'),
      );
    } finally {
      setIsSendingEmailOTP(false);
    }
  };

  const current2FAState = user?.isTwoFactorEnabled || false;

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone')) {
      return 'lucide:smartphone';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'lucide:tablet';
    }
    return 'lucide:monitor';
  };

  const getDeviceName = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('postman')) return 'Postman Desktop';
    if (ua.includes('chrome')) return 'Chrome on Desktop';
    if (ua.includes('firefox')) return 'Firefox on Desktop';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari on Apple';
    if (ua.includes('edge')) return 'Edge on Windows';
    return userAgent.split('/')[0] || t('security.sessions.unknownDevice');
  };

  return (
    <>
      <div className="space-y-6">
        {/* 2FA Card */}
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Icon icon="lucide:shield-check" className="text-primary" />
              {t('security.2fa.title')}
            </CardTitle>
            <CardDescription>{t('security.2fa.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="group flex items-center justify-between p-5 border border-border/50 rounded-xl bg-background/50 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="lucide:shield-ellipsis" className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{t('security.2fa.appName')}</p>
                  <p className="text-sm text-muted-foreground">{t('security.2fa.appDescription')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {is2FALoading && (
                  <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                <Switch
                  checked={current2FAState}
                  onCheckedChange={handleToggle2FA}
                  disabled={is2FALoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Sessions Card */}
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Icon icon="lucide:history" className="text-primary" />
              {t('security.sessions.title')}
            </CardTitle>
            <CardDescription>{t('security.sessions.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 w-full animate-pulse bg-muted rounded-xl" />
                ))}
              </div>
            ) : devices.length > 0 ? (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="group flex items-center justify-between p-5 border border-border/50 rounded-xl bg-background/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon icon={getDeviceIcon(device.userAgent)} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{getDeviceName(device.userAgent)}</p>
                        {device.isActive && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-600 border-0 h-5 px-2 text-[10px]"
                          >
                            {t('security.sessions.current')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{device.ip === '::1' ? t('security.sessions.localhost') : device.ip}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(device.lastActive), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    {t('security.sessions.logout')}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                {t('security.sessions.empty')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enable 2FA Dialog */}
      <Dialog
        open={showQRDialog}
        onOpenChange={(open) => {
          setShowQRDialog(open);
          if (!open) {
            getProfile().then((res) => res.data && setUser(res.data));
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('security.2fa.enableTitle')}</DialogTitle>
            <DialogDescription>{t('security.2fa.scanQrDesc')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              {qrCodeUri && <QRCodeSVG value={qrCodeUri} size={200} />}
            </div>
            <p className="text-xs text-center text-muted-foreground break-all max-w-xs">
              {qrCodeUri}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQRDialog(false)}>{t('security.done')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('security.2fa.disableTitle')}</DialogTitle>
            <DialogDescription>
              {isEmailMode
                ? t('security.otp.emailDesc', { email: user?.email })
                : t('security.otp.appDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            <InputOTP maxLength={6} value={otpCode} onChange={(value) => setOtpCode(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {!isEmailMode ? (
              <Button
                variant="link"
                size="sm"
                type="button"
                onClick={handleSendEmailOTP}
                disabled={isSendingEmailOTP}
                className="text-primary h-auto p-0"
              >
                {isSendingEmailOTP ? t('security.otp.sending') : t('security.otp.useEmailInstead')}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {t('security.otp.notReceived')}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  onClick={handleSendEmailOTP}
                  disabled={isSendingEmailOTP}
                  className="text-primary h-auto p-0"
                >
                  {isSendingEmailOTP ? t('security.otp.sending') : t('security.otp.resend')}
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setShowOTPDialog(false);
                setOtpCode('');
                setIsEmailMode(false);
              }}
            >
              {t('security.cancel')}
            </Button>
            <Button
              onClick={handleVerifyDisable}
              disabled={isSubmittingOTP || otpCode.length < 6}
            >
              {isSubmittingOTP ? t('security.otp.verifying') : t('security.2fa.confirmDisable')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
