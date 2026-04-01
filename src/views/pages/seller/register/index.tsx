'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Icon } from '@iconify/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { getDetailShopMe } from '@/services/shop';
import { useRouter } from 'next/navigation';
import { ROUTE_CONFIG } from '@/configs/router';
import { LoadingDialog } from '@/components/loading/LoadingDialog';
import { useTranslation } from 'react-i18next';

export default function RegisterSellerPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [slugDebounce, setSlugDebounce] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Validation schema using translations
  const registerShopSchema = useMemo(() => yup.object().shape({
    name: yup
      .string()
      .required(t('sellerRegister.validation.nameRequired'))
      .min(3, t('sellerRegister.validation.nameMin')),
    slug: yup
      .string()
      .required(t('sellerRegister.validation.slugRequired'))
      .min(3, t('sellerRegister.validation.slugMin'))
      .matches(/^[a-z0-9-]+$/, t('sellerRegister.validation.slugMatches')),
    logo: yup
      .string()
      .required(t('sellerRegister.validation.logoRequired'))
      .url(t('sellerRegister.validation.logoUrl')),
    description: yup
      .string()
      .required(t('sellerRegister.validation.descRequired'))
      .min(10, t('sellerRegister.validation.descMin')),
    addressShipId: yup.number().required(t('sellerRegister.validation.addressRequired')),
    businessType: yup
      .string()
      .required(t('sellerRegister.validation.bizTypeRequired'))
      .oneOf(['INDIVIDUAL', 'BUSINESS_HOUSEHOLD', 'COMPANY']),
    taxCode: yup
      .string()
      .required(t('sellerRegister.validation.taxCodeRequired'))
      .min(10, t('sellerRegister.validation.taxCodeMin')),
    paymentMethods: yup
      .array()
      .of(yup.string().oneOf(['COD', 'SEPAY', 'WEB3']))
      .min(1, t('sellerRegister.validation.paymentRequired')),
    deliveryTypeIds: yup
      .array()
      .of(yup.number())
      .min(1, t('sellerRegister.validation.deliveryRequired')),
  }), [t]);

  type RegisterShopFormType = yup.InferType<typeof registerShopSchema>;

  const form = useForm<RegisterShopFormType>({
    resolver: yupResolver(registerShopSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      logo: '',
      description: '',
      addressShipId: undefined,
      businessType: '',
      taxCode: '',
      paymentMethods: [],
      deliveryTypeIds: [],
    },
    mode: 'onChange',
  });

  const addressShipOptions = [
    { id: 1, label: t('search.location') + ': Hồ Chí Minh' },
    { id: 2, label: t('search.location') + ': Hà Nội' },
    { id: 3, label: t('search.location') + ': Đà Nẵng' },
  ];

  const deliveryTypes = [
    { id: 1, name: t('checkout.delivery.express') },
    { id: 2, name: t('checkout.delivery.provider') },
    { id: 3, name: t('checkout.delivery.economy') },
  ];

  const steps = useMemo(() => [
    {
      title: t('sellerRegister.steps.storeInfo.title'),
      icon: 'mdi:information-variant',
      description: t('sellerRegister.steps.storeInfo.description'),
    },
    {
      title: t('sellerRegister.steps.bizInfo.title'),
      icon: 'mdi:briefcase',
      description: t('sellerRegister.steps.bizInfo.description'),
    },
    {
      title: t('sellerRegister.steps.delivery.title'),
      icon: 'mdi:truck-fast',
      description: t('sellerRegister.steps.delivery.description'),
    },
  ], [t]);

  const fetchShopMe = async () => {
    setIsLoading(true);

    try {
      const res = await getDetailShopMe();

      if (res.data && res.status === 'success') {
        return router.replace(ROUTE_CONFIG.SELLER.DASHBOARD);
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (slugDebounce) clearTimeout(slugDebounce);

      const timeout = setTimeout(() => {
        if (value.name) {
          const generatedSlug = value.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          form.setValue('slug', generatedSlug);
        }
      }, 300);

      setSlugDebounce(timeout);
    });

    return () => subscription.unsubscribe();
  }, [form, slugDebounce]);

  useEffect(() => {
    fetchShopMe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateStep = async () => {
    const fieldsToValidate =
      currentStep === 0
        ? ['name', 'slug', 'logo', 'description', 'addressShipId']
        : currentStep === 1
          ? ['businessType', 'taxCode', 'paymentMethods']
          : ['deliveryTypeIds'];

    const isValid = await form.trigger(fieldsToValidate as any);
    return isValid;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (values: RegisterShopFormType) => {
    console.log('Form Submit:', values);
  };

  if (isLoading) {
    return <LoadingDialog isLoading  />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="mdi:store" width={24} height={24} />
              {t('sellerRegister.cardTitle')}
            </CardTitle>
            <CardDescription>
              {t('sellerRegister.cardDescription')}
            </CardDescription>

            <div className="mt-6 w-full flex items-center justify-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`${steps.length - 1 === index ? '' : 'flex flex-1 items-center gap-2'}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 transition-colors ${index < currentStep ? 'bg-primary' : 'bg-muted'}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Icon icon={steps[currentStep].icon} width={20} height={20} />
                <h3 className="font-semibold">{steps[currentStep].title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.name.label')}</FormLabel>
                          <Input placeholder={t('sellerRegister.form.name.placeholder')} {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.slug.label')}</FormLabel>
                          <Input
                            placeholder={t('sellerRegister.form.slug.placeholder')}
                            {...field}
                            disabled
                          />
                          <FormDescription>
                            {t('sellerRegister.form.slug.description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.logo.label')}</FormLabel>
                          <Input
                            placeholder={t('sellerRegister.form.logo.placeholder')}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.description.label')}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('sellerRegister.form.description.placeholder')}
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressShipId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.address.label')}</FormLabel>
                          <Controller
                            name="addressShipId"
                            control={form.control}
                            render={({ field: controllerField }) => (
                              <Select
                                onValueChange={(value) =>
                                  controllerField.onChange(Number(value))
                                }
                                value={
                                  controllerField.value
                                    ? String(controllerField.value)
                                    : ''
                                }
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('sellerRegister.form.address.placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {addressShipOptions.map((option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={String(option.id)}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.bizType.label')}</FormLabel>
                          <Controller
                            name="businessType"
                            control={form.control}
                            render={({ field: controllerField }) => (
                              <Select
                                onValueChange={controllerField.onChange}
                                value={controllerField.value || ''}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('sellerRegister.form.bizType.placeholder')} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="INDIVIDUAL">
                                    {t('sellerRegister.form.bizType.individual')}
                                  </SelectItem>
                                  <SelectItem value="BUSINESS_HOUSEHOLD">
                                    {t('sellerRegister.form.bizType.household')}
                                  </SelectItem>
                                  <SelectItem value="COMPANY">
                                    {t('sellerRegister.form.bizType.company')}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="taxCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('sellerRegister.form.taxCode.label')}</FormLabel>
                          <Input placeholder={t('sellerRegister.form.taxCode.placeholder')} {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="mb-3 block">
                        {t('sellerRegister.form.payment.label')}
                      </FormLabel>
                      <div className="space-y-3">
                        {['COD', 'SEPAY', 'WEB3'].map((method) => (
                          <Controller
                            key={method}
                            name="paymentMethods"
                            control={form.control}
                            render={({ field }) => {
                              const isChecked = field.value?.includes(method);
                              return (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, method]);
                                        } else {
                                          field.onChange(
                                            current.filter(
                                              (item) => item !== method,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {method === 'COD'
                                      ? t('sellerRegister.form.payment.cod')
                                      : method === 'SEPAY'
                                        ? t('sellerRegister.form.payment.sepay')
                                        : t('sellerRegister.form.payment.web3')}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage>
                        {form.formState.errors.paymentMethods?.message}
                      </FormMessage>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <FormLabel className="mb-3 block">
                        {t('sellerRegister.form.delivery.label')}
                      </FormLabel>
                      <div className="space-y-3">
                        {deliveryTypes.map((delivery) => (
                          <Controller
                            key={delivery.id}
                            name="deliveryTypeIds"
                            control={form.control}
                            render={({ field }) => {
                              const isChecked = field.value?.includes(
                                delivery.id,
                              );
                              return (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([
                                            ...current,
                                            delivery.id,
                                          ]);
                                        } else {
                                          field.onChange(
                                            current.filter(
                                              (id) => id !== delivery.id,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {delivery.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage>
                        {form.formState.errors.deliveryTypeIds?.message}
                      </FormMessage>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="flex-1 bg-transparent"
                  >
                    <Icon
                      icon="mdi:chevron-left"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    {t('sellerRegister.back')}
                  </Button>

                  {currentStep < 2 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1"
                    >
                      {t('sellerRegister.continue')}
                      <Icon
                        icon="mdi:chevron-right"
                        width={20}
                        height={20}
                        className="ml-2"
                      />
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1">
                      <Icon
                        icon="mdi:check"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      {t('sellerRegister.submit')}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

