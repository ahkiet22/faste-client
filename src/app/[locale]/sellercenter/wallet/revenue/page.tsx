"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
// Framer Motion removed
import { Icon } from '@iconify/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// --- MOCK INTERFACES & DATA ---

type BalanceResponse = {
  availableBalance: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  yearlyRevenue: number;
  totalOrders: number;
  totalFees: number;
};

type RevenueDaily = { date: string; amount: number };
type RevenueMonthly = { month: string; amount: number };

type BankAccount = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
} | null;

type WithdrawRequest = {
  amount: number;
  bankId: number; // For demo, we just use 1
  otp: string;
};

type TransactionType = "WITHDRAW" | "INCOME" | "FEE";
type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

type TransactionItem = {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  refId: string;
  description: string;
};

// --- FAKE API HANDLERS ---
const MOCK_BALANCE: BalanceResponse = {
  availableBalance: 45200000,
  monthlyRevenue: 15300000,
  weeklyRevenue: 4100000,
  yearlyRevenue: 125000000,
  totalOrders: 580,
  totalFees: 3200000,
};

const MOCK_DAILY_REVENUE: RevenueDaily[] = [
  { date: "01/11", amount: 500000 },
  { date: "05/11", amount: 1200000 },
  { date: "10/11", amount: 800000 },
  { date: "15/11", amount: 1500000 },
  { date: "20/11", amount: 2100000 },
  { date: "25/11", amount: 1800000 },
  { date: "30/11", amount: 2500000 },
];

const MOCK_MONTHLY_REVENUE: RevenueMonthly[] = [
  { month: "T1", amount: 8000000 },
  { month: "T2", amount: 9500000 },
  { month: "T3", amount: 11000000 },
  { month: "T4", amount: 10500000 },
  { month: "T5", amount: 13000000 },
  { month: "T6", amount: 14500000 },
  { month: "T7", amount: 15300000 }, // Current month
];

const MOCK_TRANSACTIONS: TransactionItem[] = [
    { id: 1, type: "WITHDRAW", amount: -5000000, status: "SUCCESS", createdAt: "2024-07-28T10:30:00", refId: "WDR-100293", description: "Rút tiền về tài khoản Techcombank" },
    { id: 2, type: "INCOME", amount: 850000, status: "SUCCESS", createdAt: "2024-07-30T14:15:00", refId: "ORD-998871", description: "Doanh thu đơn hàng #998871" },
    { id: 3, type: "INCOME", amount: 1250000, status: "SUCCESS", createdAt: "2024-07-30T16:22:00", refId: "ORD-998872", description: "Doanh thu đơn hàng #998872" },
    { id: 4, type: "FEE", amount: -50000, status: "SUCCESS", createdAt: "2024-07-31T08:00:00", refId: "FEE-202407", description: "Phí dịch vụ tháng 07/2024" },
    { id: 5, type: "WITHDRAW", amount: -10000000, status: "PENDING", createdAt: "2024-07-31T15:00:00", refId: "WDR-100294", description: "Yêu cầu rút tiền đang chờ xử lý" },
    { id: 6, type: "INCOME", amount: 600000, status: "SUCCESS", createdAt: "2024-07-31T18:45:00", refId: "ORD-998873", description: "Doanh thu đơn hàng #998873" },
    { id: 7, type: "WITHDRAW", amount: -2000000, status: "FAILED", createdAt: "2024-08-01T09:00:00", refId: "WDR-100295", description: "Rút tiền thất bại: Sai thông tin OTP" },
];

const MOCK_BANK_ACCOUNT: BankAccount = {
  bankName: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
  accountNumber: "19039900000001",
  accountHolder: "NGUYEN VAN A",
};
// Uncomment the line below to simulate NO bank account setup
// const MOCK_BANK_ACCOUNT: BankAccount = null;

const fakeApi = {
  fetchBalance: (): Promise<BalanceResponse> => new Promise(resolve => setTimeout(() => resolve(MOCK_BALANCE), 500)),
  fetchDailyRevenue: (): Promise<RevenueDaily[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_DAILY_REVENUE), 600)),
  fetchMonthlyRevenue: (): Promise<RevenueMonthly[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_MONTHLY_REVENUE), 700)),
  fetchBankAccount: (): Promise<BankAccount> => new Promise(resolve => setTimeout(() => resolve(MOCK_BANK_ACCOUNT), 300)),
  fetchTransactions: (): Promise<TransactionItem[]> => new Promise(resolve => setTimeout(() => resolve(MOCK_TRANSACTIONS), 800)),
  saveBankAccount: (data: any): Promise<BankAccount> => new Promise(resolve => setTimeout(() => resolve(data), 1000)),
  requestWithdraw: (data: WithdrawRequest): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), 1500)),
};

// --- UTILS ---

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const formatNumber = (value: number) => 
  new Intl.NumberFormat('vi-VN').format(value);

// --- FORM VALIDATION SCHEMAS ---

const bankAccountSchema = yup.object({
  bankName: yup.string().required("Tên ngân hàng là bắt buộc"),
  accountNumber: yup.string().required("Số tài khoản là bắt buộc").matches(/^[0-9]{8,15}$/, "Số tài khoản không hợp lệ"),
  accountHolder: yup.string().required("Tên chủ tài khoản là bắt buộc"),
}).required();
type BankAccountFormData = yup.InferType<typeof bankAccountSchema>;

const withdrawSchema = yup.object({
  amount: yup.number()
    .required("Số tiền là bắt buộc")
    .min(50000, "Số tiền tối thiểu là 50.000 VNĐ")
    .max(MOCK_BALANCE.availableBalance, "Số tiền rút vượt quá số dư khả dụng")
    .integer("Số tiền phải là số nguyên")
    .test('is-multiple-of-1000', 'Số tiền phải là bội số của 1.000', value => (value % 1000 === 0)),
  otp: yup.string().required("Mã OTP là bắt buộc").matches(/^[0-9]{6}$/, "Mã OTP phải có 6 chữ số"),
}).required();
type WithdrawFormData = yup.InferType<typeof withdrawSchema>;

// --- SHADCN/UI & CUSTOM COMPONENTS (Inline) ---

// Card Component (Removed motion wrapper)
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

// Input/Form components
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }>(
  ({ className = '', label, error, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'success', size?: 'default' | 'sm' | 'lg' }>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/30',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100 text-gray-700',
      success: 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/30',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-lg',
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Dialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  // Use CSS transitions for modal animation
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div
        // Added a transition class for the modal content itself
        className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out scale-100"
      >
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- SKELETON LOADERS ---

const StatCardSkeleton = () => (
  <Card className="p-6 h-36">
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </Card>
);

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);


// --- STATS OVERVIEW ---

interface Stat {
  title: string;
  value: number;
  icon: string;
  color: string;
  isCurrency?: boolean;
}

const StatCardItem = ({ stat }: { stat: Stat }) => (
  // Removed delay prop and motion logic
  <Card className="p-5 flex flex-col justify-between h-36">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
      <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
        <Icon icon={stat.icon} className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <h3 className="text-3xl font-bold mt-2 text-gray-900">
      {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
    </h3>
    <p className="text-xs text-gray-400 mt-1">
      {stat.isCurrency ? 'Đơn vị: VNĐ' : 'Đơn vị: Đơn hàng'}
    </p>
  </Card>
);

const StatsOverview = ({ balance, loading }: { balance: BalanceResponse | null, loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
        <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
      </div>
    );
  }

  if (!balance) return null;

  const stats: Stat[] = [
    { title: 'Số dư khả dụng', value: balance.availableBalance, icon: 'mdi:wallet-bifold', color: 'bg-indigo-500', isCurrency: true },
    { title: 'Doanh thu tháng này', value: balance.monthlyRevenue, icon: 'mdi:calendar-month', color: 'bg-green-500', isCurrency: true },
    { title: 'Doanh thu tuần này', value: balance.weeklyRevenue, icon: 'mdi:calendar-week', color: 'bg-blue-500', isCurrency: true },
    { title: 'Doanh thu năm nay', value: balance.yearlyRevenue, icon: 'mdi:calendar-star', color: 'bg-purple-500', isCurrency: true },
    { title: 'Tổng số đơn hàng', value: balance.totalOrders, icon: 'mdi:cart-check', color: 'bg-orange-500', isCurrency: false },
    { title: 'Tổng phí đã trừ', value: balance.totalFees, icon: 'mdi:cash-remove', color: 'bg-red-500', isCurrency: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCardItem key={stat.title} stat={stat} />
      ))}
    </div>
  );
};


// --- REVENUE CHARTS ---

const RevenueCharts = ({ dailyData, monthlyData, loading }: { dailyData: RevenueDaily[] | null, monthlyData: RevenueMonthly[] | null, loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6 h-96"><Skeleton className="h-full w-full" /></Card>
        <Card className="p-6 h-96"><Skeleton className="h-full w-full" /></Card>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm">
          <p className="font-semibold text-gray-700">{label}</p>
          <p className="text-indigo-600">Doanh thu: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="p-6 h-96">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Doanh thu theo ngày (Tháng này)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={dailyData || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 h-96">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Doanh thu theo tháng (Năm nay)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={monthlyData || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};


// --- WITHDRAWAL FEATURE ---

// 1. Bank Account Setup Modal
const BankAccountSetupModal = ({ isOpen, onClose, currentAccount, onSave }: { isOpen: boolean, onClose: () => void, currentAccount: BankAccount, onSave: (data: BankAccount) => void }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BankAccountFormData>({
    resolver: yupResolver(bankAccountSchema),
    defaultValues: currentAccount || { bankName: '', accountNumber: '', accountHolder: '' },
  });

  const onSubmit: SubmitHandler<BankAccountFormData> = async (data) => {
    try {
        const savedAccount = await fakeApi.saveBankAccount(data);
        onSave(savedAccount);
        onClose();
    } catch (e) {
        alert("Lưu thông tin thất bại!");
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={currentAccount ? "Cập nhật tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Tên Ngân hàng (VD: Techcombank)" 
          {...register("bankName")} 
          error={errors.bankName?.message} 
        />
        <Input 
          label="Số tài khoản" 
          type="number" 
          {...register("accountNumber")} 
          error={errors.accountNumber?.message} 
        />
        <Input 
          label="Tên chủ tài khoản" 
          {...register("accountHolder")} 
          error={errors.accountHolder?.message} 
        />
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Icon icon="mdi:loading" className="h-5 w-5 animate-spin mr-2" /> : <Icon icon="mdi:content-save-outline" className="h-5 w-5 mr-2" />}
            {currentAccount ? "Cập nhật" : "Lưu tài khoản"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

// 2. Withdraw Request Modal
const WithdrawRequestModal = ({ isOpen, onClose, availableBalance, bankAccount }: { isOpen: boolean, onClose: () => void, availableBalance: number, bankAccount: BankAccount }) => {
    const MIN_WITHDRAWAL = 50000;
    const FEE_PERCENT = 0.00; // 0% fee for simplicity
    
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<WithdrawFormData>({
      resolver: yupResolver(withdrawSchema),
      defaultValues: { amount: MIN_WITHDRAWAL, otp: '' },
    });

    const amount = watch('amount') || 0;
    const fee = amount * FEE_PERCENT;
    const receiveAmount = amount - fee;

    const onSubmit: SubmitHandler<WithdrawFormData> = async (data) => {
        if (!bankAccount) {
            alert("Lỗi: Thông tin ngân hàng chưa được cung cấp.");
            return;
        }
        try {
            await fakeApi.requestWithdraw({ amount: data.amount, bankId: 1, otp: data.otp });
            onClose();
            // Using console.log instead of alert for success message
            console.log(`Yêu cầu rút tiền ${formatCurrency(data.amount)} đã được gửi thành công!`); 
        } catch (e) {
            console.error("Yêu cầu rút tiền thất bại:", e);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Yêu cầu rút tiền">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Bank Account Info */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2">
                    <p className="text-sm font-medium text-gray-700 flex justify-between items-center">
                        <span>Tài khoản nhận:</span>
                        <span className="text-green-600 font-bold">Đã xác thực</span>
                    </p>
                    <p className="text-lg font-semibold text-gray-900">{bankAccount?.accountHolder}</p>
                    <p className="text-sm text-gray-500">{bankAccount?.bankName} | {bankAccount?.accountNumber}</p>
                </div>

                {/* Amount Input */}
                <div className="space-y-1">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-gray-700">Số tiền muốn rút (VNĐ)</label>
                        <span className="text-xs text-gray-500">Số dư: {formatCurrency(availableBalance)}</span>
                    </div>
                    <div className="relative">
                        <Input 
                            type="number" 
                            step="1000"
                            placeholder="Tối thiểu 50,000"
                            className="text-lg h-12"
                            {...register("amount", { valueAsNumber: true })} 
                            error={errors.amount?.message}
                        />
                         <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:bg-indigo-50"
                            onClick={() => setValue('amount', availableBalance, { shouldValidate: true })}
                        >
                            Rút toàn bộ
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Số tiền rút tối thiểu: {formatCurrency(MIN_WITHDRAWAL)}
                    </p>
                </div>
                
                {/* OTP Input */}
                <Input 
                    label="Mã OTP xác thực (6 chữ số)" 
                    type="text" 
                    placeholder="Nhập mã OTP"
                    maxLength={6}
                    {...register("otp")} 
                    error={errors.otp?.message} 
                />

                {/* Summary */}
                <div className="space-y-2 border-t border-dashed pt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Phí rút tiền ({FEE_PERCENT * 100}%)</span>
                        <span>{formatCurrency(fee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>Số tiền nhận được</span>
                        <span>{formatCurrency(receiveAmount)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
                    <Button type="submit" variant="success" disabled={isSubmitting || amount < MIN_WITHDRAWAL}>
                        {isSubmitting ? <Icon icon="mdi:loading" className="h-5 w-5 animate-spin mr-2" /> : <Icon icon="mdi:cash-fast" className="h-5 w-5 mr-2" />}
                        Gửi yêu cầu rút
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};

// 3. Withdraw Action Card
const WithdrawActionCard = ({ balance, bankAccount, onSetupBank, onWithdraw }: { balance: BalanceResponse | null, bankAccount: BankAccount | null, onSetupBank: () => void, onWithdraw: () => void }) => {
  const isBankSetup = !!bankAccount;
  const availableBalance = balance?.availableBalance ?? 0;

  return (
    <Card className="p-6 bg-indigo-50/70 border-indigo-200">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Icon icon="mdi:bank-outline" className="h-6 w-6 text-indigo-600" />
        Quản lý Ví & Rút tiền
      </h3>
      
      <div className="mt-4 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm">
            <p className="text-sm text-gray-500">Số dư khả dụng</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{formatCurrency(availableBalance)}</p>
        </div>

        {isBankSetup ? (
          <>
            <div className="text-sm text-gray-600">
              <p className="font-semibold">{bankAccount.accountHolder}</p>
              <p className="text-xs text-gray-500">{bankAccount.bankName} | {bankAccount.accountNumber}</p>
            </div>
            <Button onClick={onWithdraw} className="w-full h-12 text-lg">
              <Icon icon="mdi:cash-send" className="h-6 w-6 mr-2" />
              Yêu cầu Rút tiền
            </Button>
            <Button variant="outline" onClick={onSetupBank} className="w-full text-sm">Cập nhật tài khoản</Button>
          </>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <p className="font-medium text-red-700 flex items-center gap-2">
                <Icon icon="mdi:alert-circle-outline" className="h-5 w-5" />
                Chưa có thông tin ngân hàng!
            </p>
            <p className="text-sm text-red-600">
              Vui lòng cập nhật số tài khoản để thực hiện yêu cầu rút tiền.
            </p>
            <Button onClick={onSetupBank} variant="default" className="w-full bg-red-600 hover:bg-red-700">
              <Icon icon="mdi:account-box-multiple-outline" className="h-5 w-5 mr-2" />
              Cập nhật ngay
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};


// --- TRANSACTION HISTORY ---

const TransactionCard = ({ tx }: { tx: TransactionItem }) => {
    const iconMap = {
        WITHDRAW: { icon: "mdi:cash-minus", color: "text-red-600", bg: "bg-red-100" },
        INCOME: { icon: "mdi:cash-plus", color: "text-green-600", bg: "bg-green-100" },
        FEE: { icon: "mdi:cash-remove", color: "text-gray-600", bg: "bg-gray-100" },
    };
    const statusMap = {
        PENDING: { icon: "mdi:clock-outline", color: "text-yellow-600", label: "Đang chờ" },
        SUCCESS: { icon: "mdi:check-circle-outline", color: "text-green-600", label: "Thành công" },
        FAILED: { icon: "mdi:close-circle-outline", color: "text-red-600", label: "Thất bại" },
    };
    
    const config = iconMap[tx.type];
    const statusConfig = statusMap[tx.status];

    const formattedTime = format(new Date(tx.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi });
    const amountClass = tx.amount < 0 ? 'text-red-600' : 'text-green-600';

    return (
        // Removed motion wrapper
        <div 
            className="flex items-start space-x-4 group"
        >
            {/* Timeline Marker */}
            <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${config.bg}`}>
                    <Icon icon={config.icon} className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="h-full w-0.5 bg-gray-200 group-last:hidden" />
            </div>

            {/* Transaction Card */}
            <Card className="p-4 flex-1 mb-6 hover:border-indigo-300 transition-all shadow-sm group-hover:shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800">{tx.description}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            {tx.refId} | {formattedTime}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-lg font-bold ${amountClass}`}>
                            {formatCurrency(tx.amount)}
                        </p>
                        <div className={`flex items-center justify-end gap-1 text-xs font-medium mt-1 ${statusConfig.color}`}>
                            <Icon icon={statusConfig.icon} className="h-3.5 w-3.5" />
                            {statusConfig.label}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const TransactionHistory = ({ transactions, loading }: { transactions: TransactionItem[] | null, loading: boolean }) => {
    if (loading) {
        return (
            <Card className="p-6 h-96">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Lịch sử giao dịch</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-1/5" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }
    
    return (
        <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Lịch sử giao dịch</h3>
            <div className="max-h-[500px] overflow-y-auto pr-2">
                {transactions && transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <TransactionCard key={tx.id} tx={tx} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <Icon icon="mdi:history" className="h-10 w-10 mx-auto mb-2" />
                        <p>Chưa có giao dịch nào được ghi nhận.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function WalletRevenuePage() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<RevenueDaily[] | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<RevenueMonthly[] | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Data Fetching
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bal, daily, monthly, bank, txs] = await Promise.all([
          fakeApi.fetchBalance(),
          fakeApi.fetchDailyRevenue(),
          fakeApi.fetchMonthlyRevenue(),
          fakeApi.fetchBankAccount(),
          fakeApi.fetchTransactions(),
        ]);
        setBalance(bal);
        setDailyRevenue(daily);
        setMonthlyRevenue(monthly);
        setBankAccount(bank);
        setTransactions(txs);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        // Handle error state gracefully in a real app
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handlers for Modals
  const handleOpenWithdraw = () => {
    if (!bankAccount) {
      setShowBankModal(true);
    } else {
      setShowWithdrawModal(true);
    }
  };
  
  const handleSaveBank = (account: BankAccount) => {
      setBankAccount(account);
  };

  return (
    // Removed motion wrapper, using simple Tailwind for fade-in effect on mount
    <div 
        className="p-6 md:p-8 transition-opacity duration-500"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Quản lý Ví & Doanh thu</h1>
        <p className="text-gray-500 mt-1">Tổng quan tài chính, lịch sử giao dịch và yêu cầu rút tiền của bạn.</p>
      </header>

      {/* Main Content: 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Stats & Charts) */}
        <div className="xl:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tổng quan Thống kê</h2>
            <StatsOverview balance={balance} loading={loading} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Hiệu suất Doanh thu</h2>
            <RevenueCharts dailyData={dailyRevenue} monthlyData={monthlyRevenue} loading={loading} />
          </section>
        </div>

        {/* Right Column (Withdrawal & History) */}
        <div className="xl:col-span-1 space-y-8">
          <section>
            {loading ? (
                <Card className="p-6 h-64"><Skeleton className="h-full w-full" /></Card>
            ) : (
                <WithdrawActionCard 
                    balance={balance} 
                    bankAccount={bankAccount} 
                    onSetupBank={() => setShowBankModal(true)} 
                    onWithdraw={handleOpenWithdraw}
                />
            )}
          </section>

          <section>
            <TransactionHistory transactions={transactions} loading={loading} />
          </section>
        </div>
      </div>

      {/* Modals */}
      <BankAccountSetupModal 
        isOpen={showBankModal} 
        onClose={() => setShowBankModal(false)}
        currentAccount={bankAccount}
        onSave={handleSaveBank}
      />
      
      {balance && (
          <WithdrawRequestModal 
            isOpen={showWithdrawModal} 
            onClose={() => setShowWithdrawModal(false)}
            availableBalance={balance.availableBalance}
            bankAccount={bankAccount}
          />
      )}
    </div>
  );
}