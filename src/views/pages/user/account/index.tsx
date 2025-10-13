'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ContactInfoCard from './partials/ContactInfoCard';
import { ProfileAvatar } from './partials/ProfileAvatar';
import { GENDER } from '@/constants';
import { useGetProfile } from '@/hooks/queries/useGetProfile';
import { keepPreviousData, useMutation } from '@tanstack/react-query';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { C } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';
import { useMutationUpdateProfile } from '@/hooks/mutations/use-update-profile';
import { ToastNotifications } from '@/components/ToastNotification';

type TProfileForm = {
  name: string;
  avatar: string | null;
  email: string;
  phoneNumber: string;
  day: string;
  month: string;
  year: string;
  gender: GENDER;
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  avatar: yup.string().url().nullable().default(null).notRequired(),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup
    .string()
    // .matches(/^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/, 'Invalid phone number')
    .required('Phone number is required'),
  day: yup.string().required('Day is required'),
  month: yup.string().required('Month is required'),
  year: yup.string().required('Year is required'),
  gender: yup
    .mixed<GENDER>()
    .oneOf(Object.values(GENDER), 'Invalid gender')
    .required('Gender is required'),
});

export default function AccountPage() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TProfileForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      avatar: null,
      email: '',
      phoneNumber: '',
      day: '',
      month: '',
      year: '',
      gender: GENDER.OTHER,
    },
  });

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) => (2025 - i).toString());

  const { data, isLoading } = useGetProfile({
    select: (data) => data,
    staleTime: 1000 * 60 * 5,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });

  const { isPending, mutate: mutateUpdateProfile } = useMutationUpdateProfile({
    onSuccess: () => {
      ToastNotifications.success('Notify', 'Update profile successfully!');
    },
    onError: (err) => {
      ToastNotifications.error('Notify', 'Update profile error!');
    },
  });

  console.log('render account page');

  useEffect(() => {
    if (data) {
      const { dateOfBirth, ...rest } = data;
      const d = dateOfBirth ? dayjs(dateOfBirth) : null;

      reset({
        name: rest.name || '',
        avatar: rest.avatar ?? null,
        email: rest.email || '',
        phoneNumber: rest.phoneNumber || '',
        gender: rest.gender || GENDER.OTHER,
        day: d ? String(d.date()) : '',
        month: d ? String(d.month() + 1) : '',
        year: d ? String(d.year()) : '',
      });
    }
  }, [data, reset]);

  // if (isLoading) {
  //   return <LoadingDialog isLoading={true} message="" />;
  // }

  const onSubmit = (formData: TProfileForm) => {
    const { day, month, year, email, ...rest } = formData;

    const dateOfBirth = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    const payload = { ...rest, dateOfBirth };

    console.log('Payload ready to send:', payload);
    mutateUpdateProfile(payload);
  };

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-[7]">
        <h1 className="text-lg font-medium text-muted-foreground mb-6">
          Thông tin cá nhân
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex items-start gap-4">
            <ProfileAvatar />
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Họ & Tên
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      className="mt-1"
                      placeholder="Nhập họ và tên"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <Label className="text-sm font-medium">Ngày sinh</Label>
            <div className="flex gap-2 mt-1">
              {['day', 'month', 'year'].map((fieldName, idx) => {
                const options =
                  fieldName === 'day'
                    ? days
                    : fieldName === 'month'
                      ? months
                      : years;
                return (
                  <Controller
                    key={fieldName}
                    name={fieldName as keyof TProfileForm}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          value={field.value!}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder={fieldName} />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium">Giới tính</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="MALE" />
                    <Label htmlFor="MALE" className="text-sm">
                      Nam
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="FEMALE" />
                    <Label htmlFor="FEMALE" className="text-sm">
                      Nữ
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OTHER" id="OTHER" />
                    <Label htmlFor="OTHER" className="text-sm">
                      Khác
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Lưu thay đổi
          </Button>
        </form>
      </div>

      <div className="w-[1px] h-[500px] bg-gray-200"></div>

      <div className="flex-[3]">
        <ContactInfoCard
          email={watch('email')}
          phoneNumber={watch('phoneNumber')}
        />
      </div>
    </div>
  );
}
