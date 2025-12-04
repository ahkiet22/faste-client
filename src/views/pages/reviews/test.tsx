"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useInView } from "react-intersection-observer";
import {
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// --- SHADCN UI IMPORTS ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

// ----------------------------------------------------------------------
// 1. TYPES & INTERFACES (Giữ nguyên)
// ----------------------------------------------------------------------

type ReviewTag = "Sản phẩm tốt" | "Đúng mô tả" | "Giao hàng nhanh" | "Đóng gói kỹ" | "Hàng lỗi";

interface Review {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  tags: ReviewTag[];
  content: string;
  images?: string[];
  createdAt: string;
  replyStatus: "replied" | "pending";
  sellerReply?: {
    content: string;
    createdAt: string;
  };
}

interface FilterState {
  search: string;
  star: string;
  status: "ALL" | "Replied" | "Pending Reply";
}

// ----------------------------------------------------------------------
// 2. MOCK DATA (Giữ nguyên)
// ----------------------------------------------------------------------

const MOCK_REVIEWS: Review[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `REV-${1000 + i}`,
  orderId: `ORD-${202400 + i}`,
  productId: `PROD-${i % 5}`,
  productName: i % 2 === 0 ? "Áo Thun Cotton Basic Form Rộng" : "Quần Jeans Ống Suông Korea",
  productImage: i % 2 === 0 ? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" : "https://images.unsplash.com/photo-1542272617-08f08315805d?w=100&q=80",
  sku: i % 2 === 0 ? "BLACK-XL" : "BLUE-29",
  customerName: ["Nguyễn Văn A", "Trần Thị B", "Lê C", "Phạm D"][i % 4],
  customerAvatar: `https://i.pravatar.cc/150?u=${i}`,
  rating: Math.floor(Math.random() * 2) + 4,
  tags: ["Sản phẩm tốt", "Giao hàng nhanh"],
  content: i % 3 === 0 ? "Vải mát, giao hàng nhanh. Sẽ ủng hộ shop tiếp!" : "Hàng ổn, đóng gói hơi sơ sài một chút nhưng sp vẫn ok.",
  images: i % 2 === 0 ? ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200"] : [],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  replyStatus: i % 4 === 0 ? "pending" : "replied",
  sellerReply: i % 4 !== 0 ? { content: "Shop cảm ơn bạn ạ!", createdAt: new Date().toISOString() } : undefined
}));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  getReviews: async (page: number, filters: FilterState): Promise<{ data: Review[] }> => {
    await wait(500);
    let filtered = MOCK_REVIEWS.filter(r => {
      const matchSearch = r.content.toLowerCase().includes(filters.search.toLowerCase()) || r.orderId.includes(filters.search);
      const matchStar = filters.star === "all" || r.rating.toString() === filters.star;
      const matchStatus = filters.status === "ALL" || (filters.status === "Replied" && r.replyStatus === "replied") || (filters.status === "Pending Reply" && r.replyStatus === "pending");
      return matchSearch && matchStar && matchStatus;
    });
    return { data: filtered };
  },
  replyReview: async (reviewId: string, content: string) => {
    await wait(800);
    return { success: true };
  }
};

// ----------------------------------------------------------------------
// 3. COMPONENTS
// ----------------------------------------------------------------------

// --- 3.1 Stats Sidebar ---
const StatsSidebar = () => {
  // Mock Data Chart
  const dataDaily = [
    { name: 'T2', count: 12 }, { name: 'T3', count: 19 }, { name: 'T4', count: 8 },
    { name: 'T5', count: 22 }, { name: 'T6', count: 15 }, { name: 'T7', count: 30 }, { name: 'CN', count: 25 },
  ];
  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-none border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-700">Đánh giá chung</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-end gap-3 mb-4">
             <span className="text-4xl font-bold text-gray-900">4.8</span>
             <div className="mb-1 text-yellow-400 flex">
               {[1,2,3,4,5].map(i => <Icon key={i} icon="ph:star-fill" width={16} />)}
             </div>
           </div>
           <div className="space-y-2">
             {[5,4,3,2,1].map((star) => (
               <div key={star} className="flex items-center gap-2 text-xs">
                 <span className="w-3 text-gray-500">{star}</span>
                 <Icon icon="ph:star-fill" className="text-gray-300 w-3 h-3" />
                 <Progress value={star === 5 ? 80 : star === 4 ? 15 : 5} className="h-1.5 flex-1" />
               </div>
             ))}
           </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-xl shadow-none border border-gray-200">
        <CardContent className="p-4 h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataDaily}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="count" fill="#6366f1" radius={[2, 2, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// --- 3.2 Modals (Reply & Detail) ---
const replySchema = yup.object().shape({ content: yup.string().required().min(5) });

const ReplyModal = ({ review, open, onOpenChange, onSubmitSuccess }: any) => {
  const form = useForm({ resolver: yupResolver(replySchema) });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && review) form.reset({ content: review.sellerReply?.content || "" });
  }, [open, review]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await api.replyReview(review.id, data.content);
    onSubmitSuccess(review.id, data.content);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá #{review?.id}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="content" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormControl><Textarea placeholder="Nhập câu trả lời..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
               {["Cảm ơn bạn!", "Xin lỗi vì sự cố."].map(t => (
                 <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => form.setValue("content", t)}>{t}</Badge>
               ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Đang gửi..." : "Gửi"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DetailModal = ({ review, open, onOpenChange }: any) => {
    if (!review) return null;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Chi tiết</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <Image width={64} height={64} src={review.productImage} alt="s" className="w-16 h-16 rounded object-cover" />
                        <div>
                            <p className="font-semibold">{review.productName}</p>
                            <p className="text-sm text-gray-500">{review.sku} • {review.orderId}</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex text-yellow-500 mb-2">
                            {Array(5).fill(0).map((_,i) => <Icon key={i} icon={i < review.rating ? "ph:star-fill" : "ph:star"} />)}
                        </div>
                        <p className="text-gray-800">{review.content}</p>
                        {review.images?.length > 0 && (
                            <div className="flex gap-2 mt-3">
                                {review.images.map((img:string, i:number) => (
                                    <Image width={80} height={80} alt="2" key={i} src={img} className="w-20 h-20 rounded border object-cover" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ----------------------------------------------------------------------
// 4. MAIN PAGE (TABLE VIEW)
// ----------------------------------------------------------------------

export default function ReviewsTablePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ search: "", star: "all", status: "ALL" });
  
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Infinite scroll refs
  const { ref, inView } = useInView();

  useEffect(() => { fetchReviews(); }, [filters]);

  const fetchReviews = async () => {
    setIsLoading(true);
    const res = await api.getReviews(1, filters);
    setReviews(res.data);
    setIsLoading(false);
  };

  const handleReplySuccess = (id: string, content: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replyStatus: "replied", sellerReply: { content, createdAt: new Date().toISOString() } } : r));
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-gray-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h1>
           <p className="text-gray-500 text-sm">Quản lý phản hồi khách hàng tập trung.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-9 gap-2"><Icon icon="ph:download-simple" /> Xuất Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content (Table) */}
        <div className="lg:col-span-3 space-y-4">
           
           {/* Filters */}
           <div className="flex flex-wrap gap-3 items-center bg-white p-1">
              <div className="relative w-full md:w-64">
                 <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <Input 
                    placeholder="Tìm đơn hàng, sản phẩm..." 
                    className="pl-9 h-9" 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                 />
              </div>
              <Select value={filters.star} onValueChange={(v) => setFilters({...filters, star: v})}>
                 <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Số sao" /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">Tất cả sao</SelectItem>
                    <SelectItem value="5">5 Sao</SelectItem>
                    <SelectItem value="4">4 Sao</SelectItem>
                    <SelectItem value="3">3 Sao</SelectItem>
                    <SelectItem value="2">2 Sao</SelectItem>
                    <SelectItem value="1">1 Sao</SelectItem>
                 </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(v: any) => setFilters({...filters, status: v})}>
                 <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                 <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="Pending Reply">Chưa trả lời</SelectItem>
                    <SelectItem value="Replied">Đã trả lời</SelectItem>
                 </SelectContent>
              </Select>
           </div>

           {/* TABLE VIEW */}
           <div className="rounded-lg border border-gray-200 overflow-hidden">
             <Table>
               <TableHeader className="bg-gray-50/50">
                 <TableRow>
                   <TableHead className="w-[280px]">Sản phẩm</TableHead>
                   <TableHead className="w-[180px]">Khách hàng</TableHead>
                   <TableHead className="min-w-[300px]">Nội dung đánh giá</TableHead>
                   <TableHead className="w-[120px]">Trạng thái</TableHead>
                   <TableHead className="w-[50px]"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {isLoading ? (
                   // Skeleton Rows
                   Array.from({length: 5}).map((_, i) => (
                     <TableRow key={i}>
                       <TableCell><div className="flex gap-2"><Skeleton className="h-10 w-10 rounded"/><div className="space-y-1"><Skeleton className="h-4 w-32"/><Skeleton className="h-3 w-20"/></div></div></TableCell>
                       <TableCell><div className="flex gap-2"><Skeleton className="h-8 w-8 rounded-full"/><div className="space-y-1"><Skeleton className="h-4 w-24"/></div></div></TableCell>
                       <TableCell><div className="space-y-2"><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-2/3"/></div></TableCell>
                       <TableCell><Skeleton className="h-6 w-20 rounded-full"/></TableCell>
                       <TableCell><Skeleton className="h-8 w-8"/></TableCell>
                     </TableRow>
                   ))
                 ) : reviews.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        Không tìm thấy đánh giá nào.
                     </TableCell>
                   </TableRow>
                 ) : (
                   reviews.map((review) => (
                     <TableRow key={review.id} className="hover:bg-gray-50/50 transition-colors">
                       {/* Product Column */}
                       <TableCell className="align-top py-4">
                          <div className="flex gap-3">
                             <Image width={40} height={40} src={review.productImage} alt="prod" className="w-10 h-10 rounded object-cover border border-gray-100 flex-shrink-0" />
                             <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2" title={review.productName}>{review.productName}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{review.sku}</p>
                             </div>
                          </div>
                       </TableCell>
                       
                       {/* Customer Column */}
                       <TableCell className="align-top py-4">
                          <div className="flex items-center gap-2">
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={review.customerAvatar} />
                                <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-sm font-medium text-gray-900">{review.customerName}</p>
                                <p className="text-xs text-gray-400">{format(new Date(review.createdAt), "dd/MM/yyyy")}</p>
                             </div>
                          </div>
                       </TableCell>

                       {/* Content & Rating Column */}
                       <TableCell className="align-top py-4">
                          <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                   {Array(5).fill(0).map((_, i) => (
                                      <Icon key={i} icon={i < review.rating ? "ph:star-fill" : "ph:star"} width={14} className={i >= review.rating ? "text-gray-200" : ""} />
                                   ))}
                                </div>
                                <div className="flex gap-1">
                                   {review.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{tag}</span>
                                   ))}
                                </div>
                             </div>
                             
                             <p className="text-sm text-gray-700 line-clamp-2">
                                {review.content}
                             </p>

                             {review.images && review.images.length > 0 && (
                                <div className="flex gap-2">
                                   {review.images.map((img, i) => (
                                      <div key={i} className="w-8 h-8 rounded border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80" onClick={() => { setSelectedReview(review); setDetailModalOpen(true); }}>
                                         <Image width={100} height={100} src={img} alt="s" className="w-full h-full object-cover" />
                                      </div>
                                   ))}
                                </div>
                             )}

                             {/* Reply Preview */}
                             {review.sellerReply && (
                                <div className="mt-2 pl-3 border-l-2 border-gray-200">
                                   <p className="text-xs text-gray-500 italic line-clamp-1">
                                      <span className="font-semibold text-gray-700 not-italic">Shop:</span> {review.sellerReply.content}
                                   </p>
                                </div>
                             )}
                          </div>
                       </TableCell>

                       {/* Status Column */}
                       <TableCell className="align-top py-4">
                          {review.replyStatus === "replied" ? (
                             <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">Đã trả lời</Badge>
                          ) : (
                             <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-normal">Chờ trả lời</Badge>
                          )}
                       </TableCell>

                       {/* Action Column */}
                       <TableCell className="align-top py-4 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Icon icon="ph:dots-three" /></Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedReview(review); setDetailModalOpen(true); }}>
                                   Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedReview(review); setReplyModalOpen(true); }}>
                                   {review.replyStatus === "replied" ? "Sửa phản hồi" : "Trả lời"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Báo cáo</DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
           </div>
           
           {/* Load More Trigger */}
           <div ref={ref} className="h-4" />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
           <div className="sticky top-6">
              <StatsSidebar />
           </div>
        </div>
      </div>

      {/* Modals */}
      <ReplyModal open={replyModalOpen} onOpenChange={setReplyModalOpen} review={selectedReview} onSubmitSuccess={handleReplySuccess} />
      <DetailModal open={detailModalOpen} onOpenChange={setDetailModalOpen} review={selectedReview} />

    </div>
  );
}