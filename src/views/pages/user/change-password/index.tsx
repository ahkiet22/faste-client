'use client';

import { useState } from 'react';
import { toastify } from '@/components/ToastNotification';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/profile';
import { TChangePasswordBody } from '@/types/profile';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { LoadingSpinner } from '@/components/loading/LoadingSpinner';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

// Validation schema
const schema = yup.object({
  oldPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Old password is required'),

  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),

  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: TChangePasswordBody) => {
    setLoading(true);
    try {
      const res = await changePassword(data);
      if (res.error) {
        toastify.error('Change password', res.message);
      } else {
        reset({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        toastify.success('Change password', res.message);
      }
    } catch (err) {
      toastify.error('Change password', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {loading && <LoadingDialog isLoading={loading} />}
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Update your security password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Old Password */}
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="oldPassword"
                type="password"
                placeholder="Enter current Password"
                disabled={loading}
              />
            )}
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="newPassword"
                type="password"
                placeholder="Enter new Password"
                disabled={loading}
              />
            )}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="confirmNewPassword"
                type="password"
                placeholder="Confirm new Password"
                disabled={loading}
              />
            )}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-[141px]"
          >
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
