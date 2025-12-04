'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Icon } from '@iconify/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  format,
  parseISO,
  isPast,
  isFuture,
  isAfter,
  isBefore,
} from 'date-fns';

// ===================================================================================
// 1. MOCK DATA & INTERFACES
// ===================================================================================

type VoucherStatus = 'ACTIVE' | 'UPCOMING' | 'INACTIVE' | 'EXPIRED';
type VoucherType =
  | 'FREE_SHIP'
  | 'DISCOUNT_PERCENT'
  | 'DISCOUNT_AMOUNT'
  | 'PRODUCT_SPECIFIC';

interface Product {
  id: number;
  name: string;
}

interface Voucher {
  id: number;
  name: string;
  code: string;
  description?: string;
  type: VoucherType;
  value: number;
  minOrderPrice: number;
  maxDiscount?: number;
  limitPerUser: number;
  totalQuantity: number;
  usedQuantity: number;
  startAt: string;
  endAt: string;
  appliedProductIds: number[];
  status: VoucherStatus;
}

interface VoucherFormValues {
  id?: number; // Optional for creation
  name: string;
  code: string;
  description: string;
  type: VoucherType;
  value: number;
  minOrderPrice: number;
  maxDiscount?: number;
  limitPerUser: number;
  totalQuantity: number;
  startAt: string;
  endAt: string;
  appliedProductIds: number[];
}

const MOCK_PRODUCTS: Product[] = [
  { id: 101, name: 'Áo Polo Nam Classic Fit - Trắng' },
  { id: 102, name: 'Quần Jeans Slim Fit - Xanh Đậm' },
  { id: 103, name: 'Giày Sneaker Da Lộn - Đen' },
  { id: 104, name: 'Mũ Lưỡi Trai Logo' },
  { id: 105, name: 'Balo Thời Trang Đa Năng' },
];

let MOCK_VOUCHERS: Voucher[] = [
  {
    id: 1,
    name: 'Giảm 15% Mùa Hè',
    code: 'SUMMER15',
    type: 'DISCOUNT_PERCENT',
    value: 15,
    minOrderPrice: 500000,
    maxDiscount: 150000,
    limitPerUser: 1,
    totalQuantity: 500,
    usedQuantity: 420,
    startAt: '2024-06-01T00:00:00Z',
    endAt: '2024-08-31T23:59:59Z',
    appliedProductIds: [],
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Miễn Phí Giao Hàng',
    code: 'FREESHIP',
    type: 'FREE_SHIP',
    value: 30000,
    minOrderPrice: 100000,
    limitPerUser: 2,
    totalQuantity: 1000,
    usedQuantity: 950,
    startAt: '2024-07-01T00:00:00Z',
    endAt: '2024-09-30T23:59:59Z',
    appliedProductIds: [],
    status: 'ACTIVE',
  },
  {
    id: 3,
    name: 'Giảm 50K cho Đơn 200K',
    code: 'SALE50K',
    type: 'DISCOUNT_AMOUNT',
    value: 50000,
    minOrderPrice: 200000,
    limitPerUser: 3,
    totalQuantity: 200,
    usedQuantity: 10,
    startAt: '2024-10-01T00:00:00Z',
    endAt: '2024-10-31T23:59:59Z',
    appliedProductIds: [],
    status: 'UPCOMING',
  },
  {
    id: 4,
    name: 'Voucher Sản Phẩm Mới',
    code: 'NEWITEM',
    type: 'PRODUCT_SPECIFIC',
    value: 10,
    minOrderPrice: 0,
    limitPerUser: 1,
    totalQuantity: 100,
    usedQuantity: 0,
    startAt: '2024-08-15T00:00:00Z',
    endAt: '2024-12-31T23:59:59Z',
    appliedProductIds: [101, 103],
    status: 'ACTIVE',
  },
  {
    id: 5,
    name: 'Hết Hạn Tháng Trước',
    code: 'LASTCALL',
    type: 'DISCOUNT_PERCENT',
    value: 20,
    minOrderPrice: 300000,
    limitPerUser: 1,
    totalQuantity: 300,
    usedQuantity: 300,
    startAt: '2024-05-01T00:00:00Z',
    endAt: '2024-05-31T23:59:59Z',
    appliedProductIds: [],
    status: 'EXPIRED',
  },
  {
    id: 6,
    name: 'Voucher Tạm Dừng',
    code: 'PAUSED',
    type: 'DISCOUNT_AMOUNT',
    value: 100000,
    minOrderPrice: 1000000,
    limitPerUser: 1,
    totalQuantity: 50,
    usedQuantity: 5,
    startAt: '2024-01-01T00:00:00Z',
    endAt: '2025-01-01T23:59:59Z',
    appliedProductIds: [],
    status: 'INACTIVE',
  },
  {
    id: 7,
    name: 'Voucher Xả Kho',
    code: 'CLEARANCE',
    type: 'DISCOUNT_PERCENT',
    value: 50,
    minOrderPrice: 500000,
    maxDiscount: 200000,
    limitPerUser: 1,
    totalQuantity: 100,
    usedQuantity: 0,
    startAt: '2024-11-20T00:00:00Z',
    endAt: '2024-11-30T23:59:59Z',
    appliedProductIds: [104, 105],
    status: 'ACTIVE',
  },
  {
    id: 8,
    name: 'Voucher Sắp Diễn Ra Cuối Năm',
    code: 'YEAREND',
    type: 'DISCOUNT_AMOUNT',
    value: 100000,
    minOrderPrice: 800000,
    limitPerUser: 2,
    totalQuantity: 100,
    usedQuantity: 0,
    startAt: '2025-01-01T00:00:00Z',
    endAt: '2025-01-31T23:59:59Z',
    appliedProductIds: [],
    status: 'UPCOMING',
  },
];

// Re-evaluate statuses dynamically
const updateVoucherStatuses = (vouchers: Voucher[]): Voucher[] => {
  return vouchers.map((v) => {
    if (v.status === 'INACTIVE') return v; // Keep manually inactive

    const now = new Date();
    const start = parseISO(v.startAt);
    const end = parseISO(v.endAt);

    if (isPast(end)) {
      return { ...v, status: 'EXPIRED' };
    }
    if (isFuture(start) || isAfter(start, now)) {
      return { ...v, status: 'UPCOMING' };
    }
    if (isBefore(start, now) && isAfter(end, now)) {
      return { ...v, status: 'ACTIVE' };
    }
    return v;
  });
};

MOCK_VOUCHERS = updateVoucherStatuses(MOCK_VOUCHERS);

// ===================================================================================
// 2. UTILS
// ===================================================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    value,
  );

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

const getVoucherTypeLabel = (type: VoucherType) => {
  switch (type) {
    case 'FREE_SHIP':
      return 'Miễn Phí Vận Chuyển';
    case 'DISCOUNT_PERCENT':
      return 'Giảm Giá %';
    case 'DISCOUNT_AMOUNT':
      return 'Giảm Giá Tiền Mặt';
    case 'PRODUCT_SPECIFIC':
      return 'Sản Phẩm Cụ Thể';
    default:
      return 'Không xác định';
  }
};

const getVoucherValueText = (voucher: Voucher) => {
  if (voucher.type === 'DISCOUNT_PERCENT') {
    return `${voucher.value}%`;
  }
  return formatCurrency(voucher.value);
};

// ===================================================================================
// 3. API MOCK HANDLERS
// ===================================================================================

const fakeApi = {
  // API to fetch list of products for selection
  fetchProducts: (): Promise<Product[]> =>
    new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 300)),

  // API to fetch vouchers with pagination/filtering
  getVouchers: (
    page: number,
    limit: number,
    filter: { status?: VoucherStatus; type?: VoucherType },
  ): Promise<{ vouchers: Voucher[]; hasMore: boolean }> =>
    new Promise((resolve) => {
      setTimeout(() => {
        let filtered = MOCK_VOUCHERS;
        if (filter.status) {
          filtered = filtered.filter((v) => v.status === filter.status);
        }
        if (filter.type) {
          filtered = filtered.filter((v) => v.type === filter.type);
        }

        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);

        resolve({
          vouchers: updateVoucherStatuses(paginated), // Ensure status is up-to-date
          hasMore: filtered.length > startIndex + limit,
        });
      }, 1000);
    }),

  // API to create a new voucher
  createVoucher: (data: VoucherFormValues): Promise<Voucher> =>
    new Promise((resolve) => {
      setTimeout(() => {
        const newVoucher: Voucher = {
          ...data,
          id: MOCK_VOUCHERS.length + 1,
          usedQuantity: 0,
          status: updateVoucherStatuses([
            { ...data, id: 0, usedQuantity: 0, status: 'UPCOMING' },
          ])[0].status, // Set initial status
        };
        MOCK_VOUCHERS.push(newVoucher);
        resolve(newVoucher);
      }, 1500);
    }),

  // API to update an existing voucher
  updateVoucher: (data: VoucherFormValues): Promise<Voucher> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_VOUCHERS.findIndex((v) => v.id === data.id);
        if (index === -1) {
          reject('Voucher not found');
          return;
        }
        const updatedVoucher: Voucher = {
          ...MOCK_VOUCHERS[index],
          ...data,
          status: MOCK_VOUCHERS[index].status, // Keep current status unless explicitly changed
        };
        MOCK_VOUCHERS[index] = updatedVoucher;
        resolve(updatedVoucher);
      }, 1500);
    }),

  // API to toggle voucher status (ACTIVE <-> INACTIVE)
  toggleVoucher: (id: number): Promise<Voucher> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_VOUCHERS.findIndex((v) => v.id === id);
        if (index === -1) {
          reject('Voucher not found');
          return;
        }
        const currentStatus = MOCK_VOUCHERS[index].status;
        let newStatus: VoucherStatus;

        if (currentStatus === 'ACTIVE' || currentStatus === 'UPCOMING') {
          newStatus = 'INACTIVE';
        } else if (currentStatus === 'INACTIVE') {
          // Re-evaluate to ACTIVE/UPCOMING if dates allow
          const tempVoucher = {
            ...MOCK_VOUCHERS[index],
            status: 'ACTIVE' as VoucherStatus,
          };
          newStatus = updateVoucherStatuses([tempVoucher])[0].status;
        } else {
          reject('Cannot toggle EXPIRED voucher');
          return;
        }

        MOCK_VOUCHERS[index] = { ...MOCK_VOUCHERS[index], status: newStatus };
        resolve(MOCK_VOUCHERS[index]);
      }, 500);
    }),

  // API to delete voucher
  deleteVoucher: (id: number): Promise<void> =>
    new Promise((resolve) => {
      setTimeout(() => {
        MOCK_VOUCHERS = MOCK_VOUCHERS.filter((v) => v.id !== id);
        resolve();
      }, 500);
    }),
};

// ===================================================================================
// 4. VALIDATION SCHEMA
// ===================================================================================

const voucherSchema = yup
  .object({
    id: yup.number().optional(),
    name: yup
      .string()
      .required('Tên voucher là bắt buộc')
      .max(100, 'Tên không quá 100 ký tự'),
    code: yup
      .string()
      .required('Mã voucher là bắt buộc')
      .matches(/^[A-Z0-9]+$/, 'Mã chỉ chứa chữ hoa và số')
      .max(20, 'Mã không quá 20 ký tự'),
    description: yup
      .string()
      .max(500, 'Mô tả không quá 500 ký tự')
      .required('Mô tả là bắt buộc'),
    type: yup
      .mixed<VoucherType>()
      .oneOf([
        'FREE_SHIP',
        'DISCOUNT_PERCENT',
        'DISCOUNT_AMOUNT',
        'PRODUCT_SPECIFIC',
      ])
      .required('Loại voucher là bắt buộc'),

    // Value validation
    value: yup
      .number()
      .required('Giá trị giảm là bắt buộc')
      .when('type', ([type], schema) => {
        if (type === 'DISCOUNT_PERCENT') {
          return schema
            .min(1, 'Phải lớn hơn 0')
            .max(100, 'Phần trăm không quá 100%');
        } else {
          return schema.min(1000, 'Giá trị tối thiểu 1.000 VNĐ');
        }
      }),

    minOrderPrice: yup
      .number()
      .required('Giá trị đơn hàng tối thiểu là bắt buộc')
      .min(0, 'Không được nhỏ hơn 0'),

    // Max Discount validation (only for DISCOUNT_PERCENT)
    maxDiscount: yup.number().when('type', ([type], schema) => {
      if (type === 'DISCOUNT_PERCENT') {
        return schema
          .required('Giảm tối đa là bắt buộc')
          .min(1000, 'Tối thiểu 1.000 VNĐ');
      }
      return schema.optional().nullable();
    }),

    limitPerUser: yup
      .number()
      .required('Giới hạn sử dụng mỗi người là bắt buộc')
      .min(1, 'Tối thiểu là 1'),
    totalQuantity: yup
      .number()
      .required('Số lượng voucher là bắt buộc')
      .min(1, 'Tối thiểu là 1'),

    // Time validation
    startAt: yup.string().required('Ngày bắt đầu là bắt buộc'),
    endAt: yup
      .string()
      .required('Ngày kết thúc là bắt buộc')
      .test(
        'is-after-start',
        'Ngày kết thúc phải sau ngày bắt đầu',
        function (endAt) {
          const { startAt } = this.parent;
          if (!startAt || !endAt) return true;
          return isAfter(parseISO(endAt), parseISO(startAt));
        },
      ),

    // Product validation
    appliedProductIds: yup
      .array(yup.number())
      .when('type', ([type], schema) => {
        if (type === 'PRODUCT_SPECIFIC') {
          return schema.min(1, 'Phải chọn ít nhất 1 sản phẩm áp dụng');
        }
        return schema.optional().min(0);
      }),
  })
  .required();

// ===================================================================================
// 5. HELPER COMPONENTS (Inline Shadcn/UI Style)
// ===================================================================================

// Component: Card
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = 'Card';

// Component: Button
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'success' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default:
        'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/30',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      ghost: 'hover:bg-gray-100 text-gray-700',
      success:
        'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/30',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-11 px-8 text-lg',
      icon: 'h-10 w-10',
    };
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

// Component: Input
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  }
>(({ className = '', label, error, ...props }, ref) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));
Input.displayName = 'Input';

// Component: Textarea
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  }
>(({ className = '', label, error, ...props }, ref) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <textarea
      ref={ref}
      className={`flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none ${className} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

// Component: Select
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
  }
>(({ className = '', label, error, options, ...props }, ref) => (
  <div className="space-y-1">
    {label && (
      <label className="text-sm font-medium text-gray-700">{label}</label>
    )}
    <div className="relative">
      <select
        ref={ref}
        className={`appearance-none block h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        icon="mdi:chevron-down"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));
Select.displayName = 'Select';

// Component: Dialog (Modal)
const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b p-5 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <Icon icon="mdi:close" className="h-6 w-6" />
              </button>
            </div>
            {/* Content */}
            <div className="p-5 flex-grow overflow-y-auto">{children}</div>
            {/* Footer */}
            {footer && (
              <div className="flex justify-end items-center border-t p-4 bg-gray-50 sticky bottom-0 z-10">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Component: Skeleton Loader
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
);

// Component: MultiSelect Mock for Applied Products
const MultiSelectMock = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    error?: string;
    options: Product[];
    value: number[];
    onChange: (value: number[]) => void;
  }
>(({ label, error, options, value, onChange }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleProduct = (productId: number) => {
    if (value.includes(productId)) {
      onChange(value.filter((id) => id !== productId));
    } else {
      onChange([...value, productId]);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1" ref={containerRef}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative" ref={ref}>
        <div
          className={`min-h-[40px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${error ? 'border-red-500' : ''}`}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((id) => {
                const product = options.find((p) => p.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                  >
                    {product?.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProduct(id);
                      }}
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                    >
                      <Icon icon="mdi:close-circle" className="h-4 w-4" />
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="text-gray-400">Chọn sản phẩm áp dụng...</span>
          )}
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <div className="p-2 border-b">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            {filteredOptions.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">
                Không tìm thấy sản phẩm.
              </p>
            ) : (
              filteredOptions.map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center text-sm"
                  onClick={() => handleToggleProduct(product.id)}
                >
                  <span>{product.name}</span>
                  {value.includes(product.id) && (
                    <Icon
                      icon="mdi:check-circle"
                      className="h-5 w-5 text-indigo-600"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});
MultiSelectMock.displayName = 'MultiSelectMock';

// ===================================================================================
// 6. MAIN COMPONENTS
// ===================================================================================

// --- STATS OVERVIEW ---

const getStatusColor = (status: VoucherStatus) => {
  switch (status) {
    case 'ACTIVE':
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: 'mdi:check-circle-outline',
      };
    case 'UPCOMING':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        icon: 'mdi:calendar-clock-outline',
      };
    case 'EXPIRED':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: 'mdi:timer-off-outline',
      };
    case 'INACTIVE':
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: 'mdi:pause-circle-outline',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: 'mdi:help-circle-outline',
      };
  }
};

const StatsOverview = ({
  vouchers,
  loading,
}: {
  vouchers: Voucher[];
  loading: boolean;
}) => {
  const counts = useMemo(() => {
    return vouchers.reduce(
      (acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        acc.TOTAL += 1;
        return acc;
      },
      { TOTAL: 0 } as Record<VoucherStatus | 'TOTAL', number>,
    );
  }, [vouchers]);

  const stats = [
    {
      title: 'Tổng Voucher',
      count: counts.TOTAL,
      status: 'TOTAL',
      icon: 'mdi:ticket-percent-outline',
    },
    {
      title: 'Đang hoạt động',
      count: counts.ACTIVE || 0,
      status: 'ACTIVE',
      icon: 'mdi:check-decagram',
    },
    {
      title: 'Sắp diễn ra',
      count: counts.UPCOMING || 0,
      status: 'UPCOMING',
      icon: 'mdi:calendar-sync',
    },
    {
      title: 'Đã hết hạn',
      count: counts.EXPIRED || 0,
      status: 'EXPIRED',
      icon: 'mdi:archive-remove',
    },
    {
      title: 'Tạm tắt',
      count: counts.INACTIVE || 0,
      status: 'INACTIVE',
      icon: 'mdi:block-helper',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => {
        const colors = getStatusColor(stat.status as VoucherStatus);
        return (
          <Card
            key={stat.title}
            className="p-4 flex flex-col justify-between h-28 hover:shadow-lg transition-shadow duration-300 cursor-default"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <div className={`p-2 rounded-full ${colors.bg}`}>
                <Icon icon={stat.icon} className={`h-5 w-5 ${colors.text}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {loading ? (
                <Skeleton className="h-8 w-1/2" />
              ) : (
                formatNumber(stat.count)
              )}
            </h3>
          </Card>
        );
      })}
    </div>
  );
};

// --- VOUCHER CARD ITEM ---

const VoucherCard = ({
  voucher,
  onEdit,
  onView,
  onToggle,
  onDelete,
  index,
}: {
  voucher: Voucher;
  onEdit: () => void;
  onView: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}) => {
  const colors = getStatusColor(voucher.status);
  const progress = (voucher.usedQuantity / voucher.totalQuantity) * 100;
  const isToggleDisabled = voucher.status === 'EXPIRED';

  const getStatusLabel = (status: VoucherStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'UPCOMING':
        return 'Sắp diễn ra';
      case 'EXPIRED':
        return 'Đã hết hạn';
      case 'INACTIVE':
        return 'Tạm tắt';
    }
  };

  return (
    <Card
      className="flex flex-col justify-between hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Header: Status */}
      <div
        className={`flex items-center justify-between p-2 -m-4 mb-4 rounded-t-xl ${colors.bg}`}
      >
        <div
          className={`flex items-center gap-2 text-sm font-semibold ${colors.text}`}
        >
          <Icon icon={colors.icon} className="h-5 w-5" />
          {getStatusLabel(voucher.status)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/50"
          onClick={onView}
        >
          <Icon icon="mdi:eye-outline" className={`h-5 w-5 ${colors.text}`} />
        </Button>
      </div>

      {/* Main Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {voucher.name}
        </h3>
        <p className="text-sm font-mono tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1">
          {voucher.code}
        </p>
        <div className="mt-3 space-y-2 text-sm">
          <p className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Loại:</span>
            <span className="font-semibold text-gray-800">
              {getVoucherTypeLabel(voucher.type)}
            </span>
          </p>
          <p className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Giá trị giảm:</span>
            <span className="text-2xl font-extrabold text-red-600">
              {getVoucherValueText(voucher)}
            </span>
          </p>
        </div>
      </div>

      {/* Usage & Timeline */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Đã dùng: {formatNumber(voucher.usedQuantity)} /{' '}
            {formatNumber(voucher.totalQuantity)}
          </span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className={`h-2.5 rounded-full ${colors.text.replace('text-', 'bg-')}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Từ: {format(parseISO(voucher.startAt), 'dd/MM/yyyy')} - Đến:{' '}
          {format(parseISO(voucher.endAt), 'dd/MM/yyyy')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 gap-2">
        <Button
          variant={voucher.status === 'ACTIVE' ? 'destructive' : 'success'}
          size="sm"
          className="w-1/2"
          onClick={() => onToggle(voucher.id)}
          disabled={isToggleDisabled}
        >
          {voucher.status === 'ACTIVE' ? (
            <Icon icon="mdi:pause" className="h-5 w-5" />
          ) : (
            <Icon icon="mdi:play" className="h-5 w-5" />
          )}
          {voucher.status === 'ACTIVE' ? 'Tắt' : 'Bật'}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Icon icon="mdi:pencil-outline" className="h-5 w-5" />
          Sửa
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(voucher.id)}
          className="text-red-500 hover:bg-red-50"
        >
          <Icon icon="mdi:trash-can-outline" className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

// --- VOUCHER DETAIL MODAL ---
const VoucherDetailModal = ({
  isOpen,
  onClose,
  voucher,
  allProducts,
  onEdit,
  onToggle,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | null;
  allProducts: Product[];
  onEdit: (voucher: Voucher) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  if (!voucher) return null;

  const colors = getStatusColor(voucher.status);
  const progress = (voucher.usedQuantity / voucher.totalQuantity) * 100;
  const appliedProducts = allProducts.filter((p) =>
    voucher.appliedProductIds.includes(p.id),
  );

  const getStatusLabel = (status: VoucherStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'UPCOMING':
        return 'Sắp diễn ra';
      case 'EXPIRED':
        return 'Đã hết hạn';
      case 'INACTIVE':
        return 'Tạm tắt';
    }
  };

  const isToggleDisabled = voucher.status === 'EXPIRED';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi tiết Voucher: ${voucher.name}`}
      footer={
        <div className="flex gap-3 w-full">
          <Button
            variant={voucher.status === 'ACTIVE' ? 'destructive' : 'success'}
            className="w-full"
            onClick={() => {
              onToggle(voucher.id);
              onClose();
            }}
            disabled={isToggleDisabled}
          >
            {voucher.status === 'ACTIVE' ? (
              <Icon icon="mdi:pause" className="h-5 w-5 mr-2" />
            ) : (
              <Icon icon="mdi:play" className="h-5 w-5 mr-2" />
            )}
            {voucher.status === 'ACTIVE' ? 'Tắt Voucher' : 'Bật/Kích hoạt lại'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onEdit(voucher);
              onClose();
            }}
          >
            <Icon icon="mdi:pencil-outline" className="h-5 w-5 mr-2" />
            Chỉnh Sửa
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
                onDelete(voucher.id);
                onClose();
              }
            }}
          >
            <Icon icon="mdi:trash-can-outline" className="h-5 w-5 mr-2" />
            Xoá
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Core Info */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-600">{voucher.code}</h3>
          <p className="text-sm text-gray-600">{voucher.description}</p>

          <div
            className={`p-3 rounded-lg flex items-center gap-3 ${colors.bg}`}
          >
            <Icon icon={colors.icon} className={`h-6 w-6 ${colors.text}`} />
            <span className={`font-semibold ${colors.text}`}>
              {getStatusLabel(voucher.status)}
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <DetailItem
              title="Loại Voucher"
              value={getVoucherTypeLabel(voucher.type)}
            />
            <DetailItem
              title="Giá trị giảm"
              value={getVoucherValueText(voucher)}
              highlight="text-red-600 text-lg font-extrabold"
            />
            <DetailItem
              title="Đơn hàng tối thiểu"
              value={formatCurrency(voucher.minOrderPrice)}
            />
            {voucher.type === 'DISCOUNT_PERCENT' && voucher.maxDiscount && (
              <DetailItem
                title="Giảm tối đa"
                value={formatCurrency(voucher.maxDiscount)}
              />
            )}
            <DetailItem
              title="Giới hạn mỗi user"
              value={`${voucher.limitPerUser} lần`}
            />
          </div>
        </div>

        {/* Column 2: Usage & Products */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Thống kê & Phạm vi áp dụng
          </h4>

          <div className="space-y-2">
            <DetailItem
              title="Tổng số lượng"
              value={formatNumber(voucher.totalQuantity)}
            />
            <DetailItem
              title="Số lượng đã dùng"
              value={formatNumber(voucher.usedQuantity)}
              highlight="font-bold text-indigo-600"
            />
            <DetailItem
              title="Tỉ lệ sử dụng"
              value={`${progress.toFixed(2)}%`}
            />
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${colors.text.replace('text-', 'bg-')}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <DetailItem
              title="Bắt đầu"
              value={format(parseISO(voucher.startAt), 'dd/MM/yyyy HH:mm')}
            />
            <DetailItem
              title="Kết thúc"
              value={format(parseISO(voucher.endAt), 'dd/MM/yyyy HH:mm')}
            />
          </div>

          {voucher.type === 'PRODUCT_SPECIFIC' && (
            <div className="pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-700 mb-2">
                Sản phẩm áp dụng ({appliedProducts.length})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {appliedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg flex items-center gap-2"
                  >
                    <Icon
                      icon="mdi:package-variant-closed"
                      className="h-4 w-4 text-indigo-500"
                    />
                    <span>{p.name}</span>
                  </div>
                ))}
                {appliedProducts.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Không có sản phẩm nào được chọn.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const DetailItem = ({
  title,
  value,
  highlight = '',
}: {
  title: string;
  value: string;
  highlight?: string;
}) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500">{title}</span>
    <span className={`font-medium text-gray-800 ${highlight}`}>{value}</span>
  </div>
);

// --- VOUCHER FORM MODAL (CREATE/EDIT) ---
const VoucherFormModal = ({
  isOpen,
  onClose,
  currentVoucher,
  allProducts,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentVoucher: Voucher | null;
  allProducts: Product[];
  onSave: (data: VoucherFormValues) => Promise<void>;
}) => {
  const isEdit = !!currentVoucher;

  const defaultValues: VoucherFormValues = useMemo(
    () => ({
      name: currentVoucher?.name || '',
      code: currentVoucher?.code || '',
      description: currentVoucher?.description || '',
      type: currentVoucher?.type || 'DISCOUNT_AMOUNT',
      value: currentVoucher?.value || 0,
      minOrderPrice: currentVoucher?.minOrderPrice || 0,
      maxDiscount: currentVoucher?.maxDiscount || 0,
      limitPerUser: currentVoucher?.limitPerUser || 1,
      totalQuantity: currentVoucher?.totalQuantity || 1,
      startAt: currentVoucher
        ? format(parseISO(currentVoucher.startAt), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endAt: currentVoucher
        ? format(parseISO(currentVoucher.endAt), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      appliedProductIds: currentVoucher?.appliedProductIds || [],
    }),
    [currentVoucher],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormValues>({
    resolver: yupResolver(voucherSchema),
    defaultValues: defaultValues,
  });

  // Reset form when modal opens or currentVoucher changes
  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const watchedType = watch('type');
  const isPercentDiscount = watchedType === 'DISCOUNT_PERCENT';
  const isProductSpecific = watchedType === 'PRODUCT_SPECIFIC';

  const onSubmit: SubmitHandler<VoucherFormValues> = async (data) => {
    try {
      await onSave({ ...data, id: currentVoucher?.id });
      reset(defaultValues);
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu voucher:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? `Chỉnh sửa Voucher: ${currentVoucher?.name}`
          : '➕ Tạo Voucher Mới'
      }
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Icon icon="mdi:loading" className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Icon icon="mdi:content-save-outline" className="h-5 w-5 mr-2" />
            )}
            {isEdit ? 'Cập nhật' : 'Lưu Voucher'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Thông tin Cơ bản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên Voucher"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Mã Voucher"
            {...register('code')}
            error={errors.code?.message}
            // Allow editing code only for new voucher or if system allows
            readOnly={isEdit}
            className={isEdit ? 'bg-gray-100' : ''}
          />
        </div>
        <Textarea
          label="Mô tả Voucher"
          {...register('description')}
          error={errors.description?.message}
        />

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Thời gian áp dụng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bắt đầu áp dụng"
            type="datetime-local"
            {...register('startAt')}
            error={errors.startAt?.message}
          />
          <Input
            label="Kết thúc áp dụng"
            type="datetime-local"
            {...register('endAt')}
            error={errors.endAt?.message}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Điều kiện & Giá trị
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Loại Voucher"
                {...field}
                error={errors.type?.message}
                options={[
                  { value: 'DISCOUNT_AMOUNT', label: 'Giảm Giá Tiền Mặt' },
                  { value: 'DISCOUNT_PERCENT', label: 'Giảm Giá %' },
                  { value: 'FREE_SHIP', label: 'Miễn Phí Vận Chuyển' },
                  { value: 'PRODUCT_SPECIFIC', label: 'Sản Phẩm Cụ Thể' },
                ]}
              />
            )}
          />
          <Input
            label={`Giá trị giảm (${isPercentDiscount ? '%' : 'VNĐ'})`}
            type="number"
            min={0}
            step={isPercentDiscount ? 1 : 1000}
            {...register('value', { valueAsNumber: true })}
            error={errors.value?.message}
          />
          <Input
            label="Đơn hàng tối thiểu (VNĐ)"
            type="number"
            min={0}
            step={1000}
            {...register('minOrderPrice', { valueAsNumber: true })}
            error={errors.minOrderPrice?.message}
          />
        </div>

        {isPercentDiscount && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              label="Giảm tối đa (VNĐ)"
              type="number"
              min={0}
              step={1000}
              {...register('maxDiscount', { valueAsNumber: true })}
              error={errors.maxDiscount?.message}
              className="md:col-span-1"
            />
          </motion.div>
        )}

        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Giới hạn
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Số lượng Voucher"
            type="number"
            min={1}
            {...register('totalQuantity', { valueAsNumber: true })}
            error={errors.totalQuantity?.message}
          />
          <Input
            label="Giới hạn sử dụng / user"
            type="number"
            min={1}
            {...register('limitPerUser', { valueAsNumber: true })}
            error={errors.limitPerUser?.message}
          />
        </div>

        {isProductSpecific && (
          <div
          >
            <Controller
              name="appliedProductIds"
              control={control}
              render={({ field }) => (
                <MultiSelectMock
                  label="Chọn Sản phẩm Áp dụng"
                  options={allProducts}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.appliedProductIds?.message}
                />
              )}
            />
          </div>
        )}
      </form>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function VoucherManagerPage() {
  const VOUCHERS_PER_PAGE = 8;
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [displayVouchers, setDisplayVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [currentFilterStatus, setCurrentFilterStatus] = useState<
    VoucherStatus | undefined
  >(undefined);
  const [currentFilterType, setCurrentFilterType] = useState<
    VoucherType | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalMode, setModalMode] = useState<
    'create' | 'edit' | 'detail' | null
  >(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const productResponse = await fakeApi.fetchProducts();
        setAllProducts(productResponse);

        // Fetch first page
        const voucherResponse = await fakeApi.getVouchers(1, 1000, {}); // Fetch all for local filtering simplicity
        setAllVouchers(voucherResponse.vouchers);
        setLoading(false);
      } catch (e) {
        console.error('Failed to fetch initial data:', e);
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = allVouchers;

    // 1. Status Filter
    if (currentFilterStatus) {
      filtered = filtered.filter((v) => v.status === currentFilterStatus);
    }

    // 2. Type Filter
    if (currentFilterType) {
      filtered = filtered.filter((v) => v.type === currentFilterType);
    }

    // 3. Search (Name or Code)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(query) ||
          v.code.toLowerCase().includes(query),
      );
    }

    setFilteredVouchers(filtered);
    setPage(1); // Reset page on new filter/search
    setDisplayVouchers(filtered.slice(0, VOUCHERS_PER_PAGE));
    setHasMore(filtered.length > VOUCHERS_PER_PAGE);
  }, [allVouchers, currentFilterStatus, currentFilterType, searchQuery]);

  // Load More Logic
  const handleLoadMore = () => {
    const nextPage = page + 1;
    const newVouchers = filteredVouchers.slice(0, nextPage * VOUCHERS_PER_PAGE);
    setDisplayVouchers(newVouchers);
    setPage(nextPage);
    setHasMore(filteredVouchers.length > nextPage * VOUCHERS_PER_PAGE);
  };

  // --- CRUD Handlers ---

  const handleOpenCreate = () => {
    setSelectedVoucher(null);
    setModalMode('create');
  };

  const handleOpenEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setModalMode('edit');
  };

  const handleOpenDetail = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setModalMode('detail');
  };

  const handleSaveVoucher = async (data: VoucherFormValues) => {
    const isEdit = !!data.id;
    try {
      const savedVoucher = isEdit
        ? await fakeApi.updateVoucher(data)
        : await fakeApi.createVoucher(data);

      // Re-fetch all to update list and counts
      const updatedVouchers = await fakeApi.getVouchers(1, 1000, {});
      setAllVouchers(updatedVouchers.vouchers);

      console.log(
        `Voucher ${isEdit ? 'cập nhật' : 'tạo mới'} thành công!`,
        savedVoucher,
      );
    } catch (error) {
      console.error('Lỗi khi lưu voucher:', error);
      throw error; // Re-throw to be caught by form
    }
  };

  const handleToggleVoucher = async (id: number) => {
    if (
      window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái voucher này?')
    ) {
      try {
        await fakeApi.toggleVoucher(id);
        const updatedVouchers = await fakeApi.getVouchers(1, 1000, {});
        setAllVouchers(updatedVouchers.vouchers);
        console.log(`Trạng thái voucher ${id} đã được thay đổi.`);
      } catch (error) {
        console.error('Lỗi khi thay đổi trạng thái:', error);
      }
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này vĩnh viễn?')) {
      try {
        await fakeApi.deleteVoucher(id);
        setAllVouchers((prev) => prev.filter((v) => v.id !== id));
        console.log(`Voucher ${id} đã được xóa.`);
      } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
      }
    }
  };

  // Options for Filters
  const statusOptions = [
    { value: 'ACTIVE', label: 'Đang hoạt động' },
    { value: 'UPCOMING', label: 'Sắp diễn ra' },
    { value: 'INACTIVE', label: 'Tạm tắt' },
    { value: 'EXPIRED', label: 'Đã hết hạn' },
  ];
  const typeOptions = [
    { value: 'FREE_SHIP', label: 'Miễn Phí Vận Chuyển' },
    { value: 'DISCOUNT_PERCENT', label: 'Giảm Giá %' },
    { value: 'DISCOUNT_AMOUNT', label: 'Giảm Giá Tiền Mặt' },
    { value: 'PRODUCT_SPECIFIC', label: 'Sản Phẩm Cụ Thể' },
  ];

  // Card loading skeleton array
  const skeletonCards = Array(VOUCHERS_PER_PAGE)
    .fill(0)
    .map((_, i) => (
      <Card
        key={i}
        className="h-[320px] p-5 space-y-3"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.05 }}
      >
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-10 w-full mt-auto" />
      </Card>
    ));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản lý Voucher
          </h1>
          <p className="text-gray-500 mt-1">
            Tạo, theo dõi và quản lý các mã giảm giá cho khách hàng của bạn.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Icon icon="mdi:plus" className="h-6 w-6 mr-2" />
          Tạo Voucher Mới
        </Button>
      </header>

      {/* Stats Overview */}
      <StatsOverview vouchers={allVouchers} loading={loading} />

      <div
        className="space-y-6"
      >
        {/* Filters and Search */}
        <Card className="p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Tìm theo Tên hoặc Mã Voucher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lg:col-span-2"
            />
            <Select
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                ...statusOptions,
              ]}
              value={currentFilterStatus || ''}
              onChange={(e) =>
                setCurrentFilterStatus(
                  (e.target.value as VoucherStatus) || undefined,
                )
              }
            />
            <Select
              options={[
                { value: '', label: 'Tất cả loại voucher' },
                ...typeOptions,
              ]}
              value={currentFilterType || ''}
              onChange={(e) =>
                setCurrentFilterType(
                  (e.target.value as VoucherType) || undefined,
                )
              }
            />
            {/* Date Filter Mock: Simple Placeholder */}
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
              <Icon icon="mdi:calendar-range" className="h-5 w-5 mr-2" />
              Lọc theo thời gian (Tạm thời)
            </div>
          </div>
        </Card>

        {/* Voucher List (Card Grid) */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Danh sách Voucher ({filteredVouchers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? skeletonCards
              : displayVouchers.map((voucher, index) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    onEdit={() => handleOpenEdit(voucher)}
                    onView={() => handleOpenDetail(voucher)}
                    onToggle={handleToggleVoucher}
                    onDelete={handleDeleteVoucher}
                    index={index}
                  />
                ))}
          </div>

          {/* Load More/No Results */}
          {!loading && filteredVouchers.length > 0 && (
            <div className="mt-8 flex justify-center">
              {hasMore ? (
                <Button onClick={handleLoadMore} variant="outline" size="lg">
                  Tải thêm Voucher (
                  {filteredVouchers.length - displayVouchers.length} còn lại)
                  <Icon icon="mdi:chevron-down" className="h-6 w-6 ml-2" />
                </Button>
              ) : (
                <p className="text-gray-500 italic">
                  Đã tải hết tất cả ({filteredVouchers.length}) voucher.
                </p>
              )}
            </div>
          )}

          {!loading && filteredVouchers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Icon
                icon="mdi:magnify-remove-outline"
                className="h-12 w-12 mx-auto mb-4 text-gray-400"
              />
              <h3 className="text-xl font-medium text-gray-700">
                Không tìm thấy Voucher
              </h3>
              <p className="text-gray-500">
                Vui lòng điều chỉnh bộ lọc hoặc tạo một voucher mới.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Create/Edit Modal */}
      <VoucherFormModal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        currentVoucher={modalMode === 'edit' ? selectedVoucher : null}
        allProducts={allProducts}
        onSave={handleSaveVoucher}
      />

      {/* Detail Modal */}
      <VoucherDetailModal
        isOpen={modalMode === 'detail'}
        onClose={() => setModalMode(null)}
        voucher={selectedVoucher}
        allProducts={allProducts}
        onEdit={handleOpenEdit}
        onToggle={handleToggleVoucher}
        onDelete={handleDeleteVoucher}
      />
    </div>
  );
}
