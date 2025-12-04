'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// --- SHADCN UI IMPORTS (Giả lập import từ @/components/ui) ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';

// ----------------------------------------------------------------------
// 1. TYPES & INTERFACES
// ----------------------------------------------------------------------

type ReviewTag =
  | 'Sản phẩm tốt'
  | 'Đúng mô tả'
  | 'Giao hàng nhanh'
  | 'Đóng gói kỹ'
  | 'Thái độ tốt'
  | 'Hàng lỗi';

interface Review {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  customerName: string;
  customerAvatar?: string;
  orderType: 'Normal' | 'Flash Sale' | 'Combo';
  rating: number; // 1-5
  tags: ReviewTag[];
  content: string;
  images?: string[];
  videos?: string[];
  createdAt: string;
  replyStatus: 'replied' | 'pending';
  sellerReply?: {
    content: string;
    createdAt: string;
    updatedAt?: string;
  };
}

interface FilterState {
  search: string;
  star: string; // "all", "1", "2"...
  status: 'ALL' | 'Replied' | 'Pending Reply';
  media: 'ALL' | 'Has Media' | 'Text Only';
}

// ----------------------------------------------------------------------
// 2. MOCK API & DATA
// ----------------------------------------------------------------------

const MOCK_REVIEWS: Review[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `REV-${1000 + i}`,
  orderId: `ORD-${202400 + i}`,
  productId: `PROD-${i % 5}`,
  productName:
    i % 2 === 0
      ? 'Áo Thun Cotton Basic Form Rộng Unisex'
      : 'Quần Jeans Ống Suông Phong Cách Hàn Quốc',
  productImage:
    i % 2 === 0
      ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
      : 'https://images.unsplash.com/photo-1542272617-08f08315805d?w=200&h=200&fit=crop',
  sku: i % 2 === 0 ? 'TSHIRT-BLK-XL' : 'JEANS-BLUE-29',
  price: i % 2 === 0 ? 150000 : 320000,
  customerName: ['Nguyễn Văn A', 'Trần Thị B', 'Lê C', 'Phạm D'][i % 4],
  customerAvatar: `https://i.pravatar.cc/150?u=${i}`,
  orderType: i % 3 === 0 ? 'Flash Sale' : 'Normal',
  rating: Math.floor(Math.random() * 2) + 4, // Mostly 4-5 stars
  tags: ['Sản phẩm tốt', 'Giao hàng nhanh'],
  content:
    i % 3 === 0
      ? 'Sản phẩm rất đẹp, vải mát, giao hàng siêu nhanh. Sẽ ủng hộ shop tiếp!'
      : 'Hàng tạm ổn so với giá tiền.',
  images:
    i % 2 === 0
      ? ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400']
      : [],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  replyStatus: i % 4 === 0 ? 'pending' : 'replied',
  sellerReply:
    i % 4 !== 0
      ? {
          content: 'Cảm ơn bạn đã tin tưởng và ủng hộ shop ạ! <3',
          createdAt: new Date().toISOString(),
        }
      : undefined,
}));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  getReviews: async (
    page: number,
    filters: FilterState,
  ): Promise<{ data: Review[]; hasMore: boolean }> => {
    await wait(800);
    // Simple mock filter logic
    let filtered = MOCK_REVIEWS.filter((r) => {
      const matchSearch =
        r.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.orderId.includes(filters.search);
      const matchStar =
        filters.star === 'all' || r.rating.toString() === filters.star;
      const matchStatus =
        filters.status === 'ALL' ||
        (filters.status === 'Replied' && r.replyStatus === 'replied') ||
        (filters.status === 'Pending Reply' && r.replyStatus === 'pending');
      return matchSearch && matchStar && matchStatus;
    });

    // Pagination simulation
    const start = (page - 1) * 5;
    const end = start + 5;
    return { data: filtered.slice(start, end), hasMore: end < filtered.length };
  },
  replyReview: async (reviewId: string, content: string) => {
    await wait(1000);
    return { success: true };
  },
};

// ----------------------------------------------------------------------
// 3. COMPONENTS
// ----------------------------------------------------------------------

// --- 3.1 Stats Sidebar ---
const StatsSidebar = () => {
  const dataStar = [
    { name: '5★', value: 120, color: '#22c55e' },
    { name: '4★', value: 45, color: '#84cc16' },
    { name: '3★', value: 10, color: '#eab308' },
    { name: '2★', value: 5, color: '#f97316' },
    { name: '1★', value: 2, color: '#ef4444' },
  ];

  const dataDaily = [
    { name: 'T2', count: 12 },
    { name: 'T3', count: 19 },
    { name: 'T4', count: 8 },
    { name: 'T5', count: 22 },
    { name: 'T6', count: 15 },
    { name: 'T7', count: 30 },
    { name: 'CN', count: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="rounded-2xl shadow-sm border-none bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-700">
            Đánh giá chung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold text-indigo-600">4.8</span>
            <div className="mb-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon key={i} icon="ph:star-fill" width={18} />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                Dựa trên 182 đánh giá
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {dataStar.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-6 font-medium text-gray-600">
                  {item.name}
                </span>
                <Progress
                  value={(item.value / 182) * 100}
                  className="h-2 flex-1"
                />
                <span className="w-8 text-right text-gray-500">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Card */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Review 7 ngày qua</CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] w-full pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataDaily}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-xl p-4 flex flex-col items-center justify-center bg-blue-50/50 border-blue-100">
          <span className="text-2xl font-bold text-blue-700">92%</span>
          <span className="text-xs text-blue-600 font-medium">
            Tỷ lệ phản hồi
          </span>
        </Card>
        <Card className="rounded-xl p-4 flex flex-col items-center justify-center bg-purple-50/50 border-purple-100">
          <span className="text-2xl font-bold text-purple-700">45%</span>
          <span className="text-xs text-purple-600 font-medium">
            Có hình ảnh/video
          </span>
        </Card>
      </div>
    </div>
  );
};

// --- 3.2 Reply Modal ---
const replySchema = yup.object().shape({
  content: yup
    .string()
    .required('Vui lòng nhập nội dung phản hồi')
    .min(10, 'Tối thiểu 10 ký tự'),
});

const ReplyModal = ({
  review,
  open,
  onOpenChange,
  onSubmitSuccess,
}: {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: (id: string, content: string) => void;
}) => {
  const form = useForm({
    resolver: yupResolver(replySchema),
    defaultValues: { content: '' },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({ content: review?.sellerReply?.content || '' });
    }
  }, [open, review, form]);

  const quickReplies = [
    'Cảm ơn bạn đã đánh giá 5 sao cho shop!',
    'Shop rất xin lỗi vì trải nghiệm chưa tốt của bạn.',
    'Cảm ơn bạn, shop sẽ gửi mã giảm giá cho đơn sau nhé!',
  ];

  const onSubmit = async (data: { content: string }) => {
    if (!review) return;
    setIsLoading(true);
    await api.replyReview(review.id, data.content);
    onSubmitSuccess(review.id, data.content);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
          <DialogDescription>
            Trả lời khách hàng <b>{review?.customerName}</b> cho đơn hàng{' '}
            {review?.orderId}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung phản hồi..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500">
                Mẫu trả lời nhanh:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((text, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 transition-colors py-1.5"
                    onClick={() => form.setValue('content', text)}
                  >
                    {text.slice(0, 30)}...
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi phản hồi'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// --- 3.3 Detail Modal ---
const ReviewDetailModal = ({
  review,
  open,
  onOpenChange,
}: {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!review) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá #{review.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Customer & Order Info */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={review.customerAvatar} />
              <AvatarFallback>KH</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-bold text-gray-900">{review.customerName}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{review.orderId}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>
                  {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h5 className="text-sm font-semibold text-gray-500 mb-2">
              Sản phẩm
            </h5>
            <div className="flex gap-3 border p-3 rounded-lg">
              <Image
                height={56}
                width={56}
                src={review.productImage}
                className="w-14 h-14 rounded-md object-cover"
                alt="product"
              />
              <div>
                <p className="font-medium text-sm line-clamp-1">
                  {review.productName}
                </p>
                <p className="text-xs text-gray-500">Phân loại: {review.sku}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h5 className="text-sm font-semibold text-gray-500 mb-2">
              Đánh giá của khách
            </h5>
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  icon={i < review.rating ? 'ph:star-fill' : 'ph:star'}
                  width={20}
                />
              ))}
            </div>
            <p className="text-gray-800 bg-gray-50/50 p-3 rounded-lg border border-transparent">
              {review.content}
            </p>

            {/* Media Grid */}
            {(review.images?.length || 0) > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {review.images?.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden border"
                  >
                    <Image
                      width={100}
                      height={100}
                      src={img}
                      className="w-full h-full object-cover"
                      alt="review"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- 3.4 Main Review Card ---
const ReviewCard = ({
  review,
  onReply,
  onViewDetail,
}: {
  review: Review;
  onReply: () => void;
  onViewDetail: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null,
  );

  return (
    <div>
      <Card className="rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
        <CardContent className="p-0">
          <div className="p-5">
            {/* Header: User Info */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-100">
                  <AvatarImage src={review.customerAvatar} />
                  <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {review.customerName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 font-normal bg-gray-50 border-gray-200 text-gray-500"
                    >
                      {review.orderType}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="ph:dots-three-vertical-bold" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onViewDetail}>
                    Xem chi tiết
                  </DropdownMenuItem>
                  <DropdownMenuItem>Báo cáo đánh giá</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Rating & Content */}
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    icon={i < review.rating ? 'ph:star-fill' : 'ph:star'}
                    className={
                      i < review.rating ? 'text-yellow-400' : 'text-gray-200'
                    }
                    width={16}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-2">|</span>
                {review.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {review.content}
              </p>

              {/* Media Gallery Preview */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {review.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90"
                      onClick={() => setCurrentImageIndex(i)}
                    >
                      <Image
                        width={64}
                        height={64}
                        src={img}
                        alt="review"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl border border-dashed border-gray-200">
              <Image
                width={40}
                height={40}
                src={review.productImage}
                alt={review.productName}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {review.productName}
                </p>
                <p className="text-[10px] text-gray-500">{review.sku}</p>
              </div>
            </div>
          </div>

          {/* Seller Reply Section */}
          <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            {review.replyStatus === 'replied' && review.sellerReply ? (
              <div className="flex gap-3 w-full">
                <div className="w-1 bg-indigo-500 rounded-full h-auto"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-indigo-700">
                      Phản hồi của Shop
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-gray-400">
                        {format(
                          new Date(review.sellerReply.createdAt),
                          'dd/MM',
                        )}
                      </span>
                      <Icon
                        icon="ph:pencil-simple"
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-indigo-600"
                        onClick={onReply}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {review.sellerReply.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-between w-full items-center">
                <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                  <Icon icon="ph:warning-circle" /> Chưa trả lời
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 border-gray-200"
                  onClick={onReply}
                >
                  <Icon icon="ph:arrow-bend-up-left-bold" /> Trả lời
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simple Image Lightbox (Optional implementation detail) */}
      {currentImageIndex !== null && review.images && (
        <Dialog open={true} onOpenChange={() => setCurrentImageIndex(null)}>
          <DialogContent className="max-w-3xl bg-black/90 border-none p-0 overflow-hidden">
            <Image
              width={100}
              height={100}
              src={review.images[currentImageIndex]}
              className="w-full h-full max-h-[80vh] object-contain"
              alt="zoom"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. MAIN PAGE
// ----------------------------------------------------------------------

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    star: 'all',
    status: 'ALL',
    media: 'ALL',
  });

  // Modal States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Infinite Scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    fetchReviews(1);
  }, [filters]);

  useEffect(() => {
    if (inView && !isLoading) {
      // Load more logic simulation
    }
  }, [inView]);

  const fetchReviews = async (page: number) => {
    setIsLoading(true);
    const res = await api.getReviews(page, filters);
    setReviews(res.data); // Reset list for simplicity in this demo
    setIsLoading(false);
  };

  const handleReplySuccess = (id: string, content: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              replyStatus: 'replied',
              sellerReply: { content, createdAt: new Date().toISOString() },
            }
          : r,
      ),
    );
  };

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const handleOpenDetail = (review: Review) => {
    setSelectedReview(review);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 font-sans text-gray-900">
      {/* 4.1 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Quản lý Đánh giá
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Xem và phản hồi ý kiến khách hàng để cải thiện chất lượng shop.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white">
            <Icon icon="ph:export" /> Xuất CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 4.2 Left Content (Filters + List) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 flex-wrap items-center">
            <div className="relative flex-1 w-full md:w-auto">
              <Icon
                icon="ph:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Tìm theo Mã đơn, Tên sản phẩm..."
                className="pl-9 border-gray-200 bg-gray-50"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <Select
                value={filters.star}
                onValueChange={(v) => setFilters({ ...filters, star: v })}
              >
                <SelectTrigger className="w-[140px] border-gray-200">
                  <SelectValue placeholder="Số sao" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả sao</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="3">⭐⭐⭐</SelectItem>
                  <SelectItem value="1">⭐ (1-2 sao)</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(v: any) =>
                  setFilters({ ...filters, status: v })
                }
              >
                <SelectTrigger className="w-[150px] border-gray-200">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="Pending Reply">Chưa trả lời</SelectItem>
                  <SelectItem value="Replied">Đã trả lời</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" className="text-gray-500">
                <Icon icon="ph:sliders-horizontal" width={20} />
              </Button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4 min-h-[500px]">
            {isLoading ? (
              // Skeleton Loader
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-2xl p-6 space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))
            ) : reviews.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Icon
                    icon="ph:star-half-fill"
                    className="text-gray-300 w-12 h-12"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Chưa có đánh giá nào
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Thay đổi bộ lọc hoặc kiểm tra lại sau.
                </p>
              </div>
            ) : (
              <>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReply={() => handleOpenReply(review)}
                    onViewDetail={() => handleOpenDetail(review)}
                  />
                ))}
              </>
            )}

            {/* Infinite Scroll Trigger */}
            {!isLoading && reviews.length > 0 && (
              <div ref={ref} className="py-4 flex justify-center">
                <Icon
                  icon="ph:spinner"
                  className="animate-spin text-gray-400"
                  width={24}
                />
              </div>
            )}
          </div>
        </div>

        {/* 4.3 Right Sidebar (Statistics) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6">
            <StatsSidebar />
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <ReplyModal
        open={replyModalOpen}
        onOpenChange={setReplyModalOpen}
        review={selectedReview}
        onSubmitSuccess={handleReplySuccess}
      />

      <ReviewDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        review={selectedReview}
      />
    </div>
  );
}
