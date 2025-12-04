'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Package,
  Calendar as CalendarIcon,
  Download,
  Inbox,
  Send,
  Paperclip,
  Image as ImageIcon,
  Video,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UI Components Imports (Giả lập import từ @/components/ui) ---
// Trong dự án thực tế, bạn sẽ import từ file riêng. Ở đây tôi mock nhanh để code chạy được ngay.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 1. TYPES & MOCK DATA ---

type ComplaintStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED';

interface Message {
  id: string;
  sender: 'buyer' | 'seller' | 'system';
  content: string;
  createdAt: string;
  attachments?: string[];
}

interface Complaint {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar?: string;
  reason:
    | 'Hàng lỗi'
    | 'Sai sản phẩm'
    | 'Thiếu hàng'
    | 'Giao hàng chậm'
    | 'Khác';
  description: string;
  images?: string[];
  videos?: string[];
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const MOCK_COMPLAINTS: Complaint[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `COM${10000 + i}`,
  orderId: `ORD${30000 + i}`,
  customerName: i % 2 === 0 ? 'Nguyễn Văn A' : 'Trần Thị B',
  customerAvatar: `https://i.pravatar.cc/150?u=${i}`,
  reason:
    i % 3 === 0 ? 'Hàng lỗi' : i % 3 === 1 ? 'Giao hàng chậm' : 'Sai sản phẩm',
  description:
    'Sản phẩm nhận được bị trầy xước khá nặng ở mặt sau, tôi muốn đổi trả ngay lập tức.',
  images:
    i % 2 === 0
      ? ['https://placehold.co/100x100/png', 'https://placehold.co/100x100/png']
      : [],
  status: ['PENDING', 'PROCESSING', 'RESOLVED', 'REJECTED'][
    i % 4
  ] as ComplaintStatus,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: 'm1',
      sender: 'buyer',
      content: 'Tôi nhận được hàng nhưng bị vỡ góc.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    },
    {
      id: 'm2',
      sender: 'system',
      content: 'Khiếu nại đã được tạo.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    },
  ],
}));

// --- 2. API SIMULATION ---

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  getComplaints: async (page: number = 1): Promise<Complaint[]> => {
    await wait(800); // Simulate network latency
    return MOCK_COMPLAINTS; // In real app, slice based on page
  },
  replyComplaint: async (complaintId: string, message: string) => {
    await wait(1000);
    return { success: true };
  },
  updateStatus: async (complaintId: string, status: ComplaintStatus) => {
    await wait(600);
    return { success: true };
  },
};

// --- 3. HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const styles = {
    PENDING:
      'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
    RESOLVED: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
    REJECTED: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
  };

  const labels = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    REJECTED: 'Từ chối',
  };

  return (
    <Badge variant="outline" className={cn('px-2 py-1', styles[status])}>
      {labels[status]}
    </Badge>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
    <div className="bg-gray-50 p-6 rounded-full mb-4">
      <Inbox className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">
      Không tìm thấy khiếu nại nào
    </h3>
    <p className="text-gray-500 max-w-sm mt-2">
      Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.
    </p>
  </div>
);

// --- 4. SUB-COMPONENTS ---

// 4.1 Card Component
const ComplaintCard = ({
  data,
  onView,
  onReply,
  onResolve,
  onReject,
}: {
  data: Complaint;
  onView: () => void;
  onReply: () => void;
  onResolve: () => void;
  onReject: () => void;
}) => {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-500 mb-1">
              #{data.id}
            </span>
            <span className="text-xs text-gray-400">
              Đơn hàng:{' '}
              <span className="text-blue-600 cursor-pointer hover:underline">
                {data.orderId}
              </span>
            </span>
          </div>
          <StatusBadge status={data.status} />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={data.customerAvatar} />
            <AvatarFallback>{data.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {data.customerName}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="mb-3">
          <Badge
            variant="secondary"
            className="mb-2 rounded-md font-normal bg-gray-100 text-gray-800"
          >
            {data.reason}
          </Badge>
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {data.description}
          </p>
        </div>
        {data.images && data.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {data.images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="h-12 w-12 rounded-lg overflow-hidden border bg-gray-50"
              >
                <img
                  src={img}
                  alt="proof"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {data.images.length > 3 && (
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{data.images.length - 3}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-3 bg-gray-50/50 flex justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-600"
                onClick={onView}
              >
                <Eye className="w-4 h-4 mr-2" /> Chi tiết
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xem toàn bộ thông tin</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex gap-1">
          {data.status !== 'RESOLVED' && data.status !== 'REJECTED' && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={onReply}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={onResolve}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onReject}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// 4.2 Sidebar Statistics
const StatsSidebar = ({ complaints }: { complaints: Complaint[] }) => {
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'PENDING').length,
      processing: complaints.filter((c) => c.status === 'PROCESSING').length,
      resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
      rejected: complaints.filter((c) => c.status === 'REJECTED').length,
    };
  }, [complaints]);

  const StatItem = ({ icon: Icon, label, value, color, bg }: any) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-default">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', bg, color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="hidden lg:block w-72 shrink-0 space-y-6">
      <Card className="rounded-2xl shadow-sm border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Thống kê</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <StatItem
            icon={Inbox}
            label="Tổng khiếu nại"
            value={stats.total}
            color="text-gray-600"
            bg="bg-gray-100"
          />
          <Separator className="my-2" />
          <StatItem
            icon={Clock}
            label="Chờ xử lý"
            value={stats.pending}
            color="text-yellow-600"
            bg="bg-yellow-100"
          />
          <StatItem
            icon={Loader2}
            label="Đang xử lý"
            value={stats.processing}
            color="text-blue-600"
            bg="bg-blue-100"
          />
          <StatItem
            icon={CheckCircle}
            label="Đã giải quyết"
            value={stats.resolved}
            color="text-green-600"
            bg="bg-green-100"
          />
          <StatItem
            icon={XCircle}
            label="Từ chối"
            value={stats.rejected}
            color="text-red-600"
            bg="bg-red-100"
          />
        </CardContent>
      </Card>

      <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-white shadow-lg">
        <h4 className="font-semibold text-lg mb-1">Cần hỗ trợ?</h4>
        <p className="text-indigo-100 text-sm mb-4">
          Liên hệ với đội ngũ CSKH sàn nếu bạn gặp vấn đề lớn.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-indigo-700 font-semibold"
        >
          Gửi yêu cầu hỗ trợ
        </Button>
      </div>
    </div>
  );
};

// --- 5. MAIN PAGE COMPONENT ---

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await api.getComplaints();
      setComplaints(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Handlers
  const handleView = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsDetailOpen(true);
  };

  const handleReply = (c: Complaint) => {
    setSelectedComplaint(c);
    setIsReplyOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: ComplaintStatus) => {
    // Optimistic update
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
    await api.updateStatus(id, newStatus);

    // Nếu đang mở modal detail thì cập nhật luôn state của modal đó
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
  };

  // Filtering Logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Khiếu nại & Tranh chấp
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý các yêu cầu khiếu nại từ khách hàng.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Xuất CSV
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm Mã khiếu nại, Đơn hàng, Tên khách..."
              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-gray-200 bg-gray-50">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">⏳ Chờ xử lý</SelectItem>
              <SelectItem value="PROCESSING">🔨 Đang xử lý</SelectItem>
              <SelectItem value="RESOLVED">✅ Đã giải quyết</SelectItem>
              <SelectItem value="REJECTED">❌ Từ chối</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
            <span className="text-sm text-gray-500 hidden md:inline">
              Lọc theo ngày:
            </span>
            <Input
              type="date"
              className="w-[150px] bg-gray-50 border-gray-200"
            />
            <span className="text-gray-400">-</span>
            <Input
              type="date"
              className="w-[150px] bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* List Section */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="rounded-2xl border-gray-200 shadow-sm p-6 space-y-4"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredComplaints.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    data={complaint}
                    onView={() => handleView(complaint)}
                    onReply={() => handleReply(complaint)}
                    onResolve={() =>
                      handleStatusUpdate(complaint.id, 'RESOLVED')
                    }
                    onReject={() =>
                      handleStatusUpdate(complaint.id, 'REJECTED')
                    }
                  />
                ))}
              </div>
            )}

            {!isLoading && filteredComplaints.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900"
                  disabled
                >
                  Đã hiển thị hết danh sách
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <StatsSidebar complaints={complaints} />
        </div>
      </div>

      {/* --- MODALS --- */}
      <ComplaintDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        data={selectedComplaint}
        onUpdateStatus={handleStatusUpdate}
        onOpenReply={() => {
          setIsDetailOpen(false);
          setTimeout(() => setIsReplyOpen(true), 150); // slight delay for smooth transition
        }}
      />

      <ReplyModal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        complaint={selectedComplaint}
        onSubmit={async (msg, status) => {
          if (selectedComplaint) {
            // Mock API call
            await api.replyComplaint(selectedComplaint.id, msg);
            if (status) await api.updateStatus(selectedComplaint.id, status);
            setIsReplyOpen(false);
            // Refresh list locally ideally
          }
        }}
      />
    </div>
  );
}

// --- 6. DETAIL MODAL COMPONENT (FULL FEATURED) ---

function ComplaintDetailModal({
  isOpen,
  onClose,
  data,
  onUpdateStatus,
  onOpenReply,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: Complaint | null;
  onUpdateStatus: (id: string, s: ComplaintStatus) => void;
  onOpenReply: () => void;
}) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl">
        {/* Header Modal */}
        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <DialogTitle className="text-xl font-bold">
                Khiếu nại #{data.id}
              </DialogTitle>
              <StatusBadge status={data.status} />
            </div>
            <DialogDescription className="flex items-center gap-2">
              <span>Đơn hàng: {data.orderId}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>
                Ngày tạo: {format(new Date(data.createdAt), 'dd/MM/yyyy')}
              </span>
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(data.id, 'RESOLVED')}
            >
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Giải quyết
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(data.id, 'REJECTED')}
            >
              <XCircle className="w-4 h-4 mr-2 text-red-600" /> Từ chối
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Detail Info */}
          <ScrollArea className="w-1/2 p-6 border-r">
            <div className="space-y-6">
              {/* Section: Buyer */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={data.customerAvatar} />
                  <AvatarFallback>KH</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">
                    {data.customerName}
                  </p>
                  <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
                </div>
              </div>

              {/* Section: Complaint Content */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-600" /> Nội dung
                  khiếu nại
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Lý do
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {data.reason}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      Mô tả chi tiết
                    </label>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border">
                      {data.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section: Media Gallery */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600" /> Bằng chứng
                  (Hình ảnh/Video)
                </h4>
                {data.images && data.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {data.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg border bg-gray-100 overflow-hidden relative group cursor-pointer"
                      >
                        <img
                          src={img}
                          alt="evidence"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Không có hình ảnh đính kèm
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Right: Chat History */}
          <div className="w-1/2 flex flex-col bg-gray-50/30">
            <div className="p-4 border-b bg-white shadow-sm z-10">
              <h4 className="font-semibold text-gray-900">Lịch sử trao đổi</h4>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {data.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex flex-col max-w-[85%]',
                      msg.sender === 'seller'
                        ? 'ml-auto items-end'
                        : 'mr-auto items-start',
                    )}
                  >
                    <div
                      className={cn(
                        'px-4 py-3 rounded-2xl text-sm shadow-sm',
                        msg.sender === 'seller'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : msg.sender === 'system'
                            ? 'bg-gray-200 text-gray-600 text-xs py-1 px-3 self-center rounded-full mb-2'
                            : 'bg-white border text-gray-800 rounded-bl-none',
                      )}
                    >
                      {msg.content}
                    </div>
                    {msg.sender !== 'system' && (
                      <span className="text-[10px] text-gray-400 mt-1 px-1">
                        {msg.sender === 'seller' ? 'Bạn' : 'Khách'} •{' '}
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t mt-auto">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={onOpenReply}
              >
                <Send className="w-4 h-4 mr-2" /> Phản hồi khách hàng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- 7. REPLY MODAL COMPONENT (VALIDATION + ACTIONS) ---

const replySchema = yup.object().shape({
  content: yup
    .string()
    .required('Nội dung phản hồi không được để trống')
    .min(10, 'Tối thiểu 10 ký tự'),
  markAs: yup.string().optional(),
});

function ReplyModal({
  isOpen,
  onClose,
  complaint,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  onSubmit: (msg: string, status?: ComplaintStatus) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(replySchema),
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let statusToUpdate: ComplaintStatus | undefined = undefined;
      if (data.markAs === 'RESOLVED') statusToUpdate = 'RESOLVED';
      if (data.markAs === 'PROCESSING') statusToUpdate = 'PROCESSING';

      await onSubmit(data.content, statusToUpdate);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Phản hồi khiếu nại #{complaint.id}</DialogTitle>
          <DialogDescription>
            Gửi phản hồi cho <b>{complaint.customerName}</b>. Tin nhắn sẽ được
            gửi qua email và thông báo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung phản hồi</Label>
            <Textarea
              id="content"
              placeholder="Nhập nội dung chi tiết..."
              className="min-h-[120px] resize-none focus-visible:ring-indigo-500"
              {...register('content')}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-gray-500"
            >
              <Paperclip className="w-3 h-3 mr-2" /> Đính kèm ảnh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-gray-500"
            >
              <Video className="w-3 h-3 mr-2" /> Video
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
            <Label className="text-xs text-gray-500 uppercase font-semibold">
              Cập nhật trạng thái sau khi gửi
            </Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="opt-none"
                  value=""
                  className="text-indigo-600 focus:ring-indigo-500"
                  {...register('markAs')}
                  defaultChecked
                />
                <Label htmlFor="opt-none" className="font-normal">
                  Giữ nguyên trạng thái hiện tại
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="opt-process"
                  value="PROCESSING"
                  className="text-blue-600 focus:ring-blue-500"
                  {...register('markAs')}
                />
                <Label
                  htmlFor="opt-process"
                  className="font-normal flex items-center gap-2"
                >
                  Đánh dấu <StatusBadge status="PROCESSING" />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="opt-resolve"
                  value="RESOLVED"
                  className="text-green-600 focus:ring-green-500"
                  {...register('markAs')}
                />
                <Label
                  htmlFor="opt-resolve"
                  className="font-normal flex items-center gap-2"
                >
                  Đánh dấu <StatusBadge status="RESOLVED" />
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Gửi phản hồi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
