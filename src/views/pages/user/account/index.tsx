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
import { keepPreviousData } from '@tanstack/react-query';
import { useMutationUpdateProfile } from '@/hooks/mutations/use-update-profile';
import { toastify } from '@/components/ToastNotification';
import { useTranslation } from 'react-i18next';
import { LoadingDialog } from '@/components/loading/LoadingDialog';

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

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const years = Array.from({ length: 100 }, (_, i) => (2025 - i).toString());

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
  const { t } = useTranslation();

  const { data, isLoading, isFetched } = useGetProfile({
    select: (data) => data,
    staleTime: 1000 * 60 * 5,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // placeholderData: keepPreviousData,
  });

  const formValues = React.useMemo(() => {
    if (!data) return undefined;
    const d = data.dateOfBirth ? dayjs(data.dateOfBirth) : null;
    return {
      name: data.name || '',
      avatar: data.avatar ?? null,
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      gender: data.gender || GENDER.OTHER,
      day: d?.isValid() ? String(d.date()) : '',
      month: d?.isValid() ? String(d.month() + 1) : '',
      year: d?.isValid() ? String(d.year()) : '',
    };
  }, [data]);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<TProfileForm>({
    resolver: yupResolver(schema),
    values: formValues,
    resetOptions: {
      keepDefaultValues: false,
    },
  });

  const { isPending, mutate: mutateUpdateProfile } = useMutationUpdateProfile({
    onSuccess: () => {
      toastify.success('', 'Update profile successfully!');
    },
    onError: (err) => {
      toastify.error('', 'Update profile error!');
    },
  });

  const onSubmit = (formData: TProfileForm) => {
    const { day, month, year, email, ...rest } = formData;

    const dateOfBirth = new Date(Number(year), Number(month) - 1, Number(day));

    const payload = { ...rest, dateOfBirth };

    mutateUpdateProfile(payload);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {isLoading && <LoadingDialog isLoading />}
      <div className="flex-[7]">
        <h1 className="text-lg font-medium text-muted-foreground mb-6">
          {t('account.accountInfo')}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <ProfileAvatar avatar={data.avatar} />
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('account.fullName')}
                </Label>
                <Input
                  {...register("name")}
                  id="name"
                  className="mt-1"
                  placeholder="Nhập họ và tên"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <Label className="text-sm font-medium">
              {t('account.birthday')}
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(['day', 'month', 'year'] as const).map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t(`common.${fieldName}`)} />
                      </SelectTrigger>
                      <SelectContent>
                        {(fieldName === 'day'
                          ? days
                          : fieldName === 'month'
                            ? months
                            : years
                        ).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium">{t('account.gender')}</Label>
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
            {isPending ? 'Updating...' : t('common.update')}
          </Button>
        </form>
      </div>

      <div className="hidden lg:block w-[1px] min-h-[500px] bg-gray-200"></div>

      <div className="flex-[3]">
        <ContactInfoCard
          email={watch('email')}
          phoneNumber={watch('phoneNumber')}
        />
      </div>
    </div>
  );
}
