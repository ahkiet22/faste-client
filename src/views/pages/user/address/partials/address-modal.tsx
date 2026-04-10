'use client';

import addressShipService from '@/services/address-ship.service';
import { useTranslation } from 'react-i18next';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toastify } from '@/components/ToastNotification';
import { DIVISION_LEVEL } from '@/enums/division-level.constant';
import z from 'zod';
import { AddressPicker } from './AddressPicker';

const DivisionRecordSchema = z
  .object({
    [DIVISION_LEVEL.STATE]: z.string().optional(),
    [DIVISION_LEVEL.CITY]: z.string().optional(),
    [DIVISION_LEVEL.DISTRICT]: z.string().optional(),
    [DIVISION_LEVEL.WARD]: z.string().optional(),
  })
  .nullable();

const AddressShipSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Phone is invalid'),
  countryId: z.coerce.number().min(1),
  divisionId: z.coerce.number().min(1),
  address: z.string().min(1, 'Address is required'),
  houseNumber: z.string().nullable().default(''),
  street: z.string().nullable().default(''),
  town: z.string().nullable().default(''),
  zipcode: z.string().nullable().default(''),
  addressInstruction: z.string().nullable().default(''),
  isDefault: z.boolean().default(false),
  isDeliveryAddress: z.boolean().default(true),
  divisionPath: DivisionRecordSchema.nullable(),
});

type AddressFormValues = z.infer<typeof AddressShipSchema>;

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddressModalProps) {
  const { t } = useTranslation();
  const isEdit = !!initialData?.id;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressShipSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      countryId: 1,
      divisionId: 0,
      houseNumber: '',
      street: '',
      zipcode: '',
      addressInstruction: '',
      isDefault: false,
      isDeliveryAddress: true,
      divisionPath: {
        [DIVISION_LEVEL.STATE]: '',
        [DIVISION_LEVEL.DISTRICT]: '',
        [DIVISION_LEVEL.WARD]: '',
      },
    },
  });

  const watchedFields = useWatch({
    control: form.control,
    name: ['houseNumber', 'street'],
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          ...initialData,
          divisionId: Number(initialData.divisionId) || 0,
        });
      } else {
        form.reset({
          name: '',
          phone: '',
          address: '',
          countryId: 1,
          divisionId: 2,
          houseNumber: '',
          street: '',
          zipcode: '',
          addressInstruction: '',
          isDefault: false,
          isDeliveryAddress: true,
        });
      }
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (isEdit && initialData?.id) {
        await addressShipService.updateAddressShip(initialData.id, values);
      } else {
        await addressShipService.createAddressShip(values);
      }
      toastify.success(
        t('addressModal.success'),
        isEdit ? t('addressModal.updateSuccess') : t('addressModal.addSuccess'),
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      toastify.error(t('addressModal.error'), error.message || t('addressModal.saveError'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? t('addressModal.editTitle') : t('addressModal.addTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Phần 1: Thông tin liên hệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addressModal.fullName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('addressModal.fullNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addressModal.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('addressModal.phonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addressModal.houseNumber')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('addressModal.houseNumberPlaceholder')}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addressModal.street')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('addressModal.streetPlaceholder')}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="divisionId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('addressModal.division')}</FormLabel>
                  <FormControl>
                    <AddressPicker
                      value={field.value?.toString()}
                      onChange={(val) => {
                        field.onChange(Number(val.divisionId));
                        
                        form.setValue(
                          'divisionPath',
                          {
                            [DIVISION_LEVEL.STATE]: val.state?.name,
                            [DIVISION_LEVEL.DISTRICT]: val.district?.name,
                            [DIVISION_LEVEL.WARD]: val.ward?.name,
                          },
                          { shouldValidate: true },
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('addressModal.fullAddress')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('addressModal.fullAddressPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addressModal.zipcode')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder={t('addressModal.zipcodePlaceholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="addressInstruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addressModal.instruction')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('addressModal.instructionPlaceholder')}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phần 3: Tùy chọn */}
            <div className="space-y-3 bg-slate-50 p-3 rounded-md">
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDefault"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {t('addressModal.setAsDefault')}
                    </label>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="isDeliveryAddress"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDelivery"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="isDelivery"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {t('addressModal.useForDelivery')}
                    </label>
                  </div>
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={onClose}>
                {t('addressModal.cancel')}
              </Button>
              <Button
                type="submit"
                className="min-w-[100px]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t('addressModal.saving') : t('addressModal.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
