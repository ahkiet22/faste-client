'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Smile,
  MoreVertical,
  Phone,
  Video as VideoIcon,
  Info,
  X,
  ChevronLeft,
  Check,
  CheckCheck,
  Clock,
  MapPin,
  ShoppingBag,
  User,
  Ticket,
  FileText,
  Layout,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes standard shadcn utils exist

// --- SHADCN UI MOCKS (Nếu bạn đã cài shadcn, hãy import từ @/components/ui/...) ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';

// -----------------------------------------------------------------------------
// 1. TYPES & CONSTANTS
// -----------------------------------------------------------------------------

type UserType = 'buyer' | 'seller' | 'admin' | 'system';
type MessageType = 'text' | 'image' | 'video' | 'file' | 'voice' | 'system';
type MessageStatus = 'sent' | 'delivered' | 'read';

interface ChatMessage {
  id: string;
  sender: UserType;
  content: string; // URL for image/video/file
  type: MessageType;
  createdAt: string;
  status: MessageStatus;
  fileName?: string; // For files
}

interface Conversation {
  id: string;
  userType: 'buyer' | 'admin';
  name: string;
  avatar: string;
  orderId?: string; // Only for buyer
  ticketId?: string; // Only for admin
  lastMessage: string;
  unreadCount: number;
  isPinned: boolean;
  online: boolean;
  isTyping?: boolean;
  updatedAt: string;
  tags?: string[];
}

const QUICK_REPLIES = [
  'Xin chào, tôi có thể giúp gì?',
  'Shop đang kiểm tra đơn hàng...',
  'Cảm ơn bạn đã ủng hộ!',
  'Sản phẩm này hiện đang hết hàng.',
  'Bạn vui lòng chờ giây lát nhé.',
];

// -----------------------------------------------------------------------------
// 2. MOCK DATA GENERATOR
// -----------------------------------------------------------------------------

const generateMessages = (convId: string): ChatMessage[] => {
  return [
    {
      id: 'm1',
      sender: 'system',
      content: 'Cuộc trò chuyện đã bắt đầu.',
      type: 'system',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'read',
    },
    {
      id: 'm2',
      sender: 'buyer',
      content: 'Chào shop, đơn hàng #ORD-9921 của mình đi chưa?',
      type: 'text',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'read',
    },
    {
      id: 'm3',
      sender: 'seller',
      content: 'Chào bạn, shop đang đóng gói nhé.',
      type: 'text',
      createdAt: new Date(Date.now() - 3500000).toISOString(),
      status: 'read',
    },
    {
      id: 'm4',
      sender: 'buyer',
      content:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
      type: 'image',
      createdAt: new Date(Date.now() - 3400000).toISOString(),
      status: 'read',
    },
    {
      id: 'm5',
      sender: 'buyer',
      content: 'Mình muốn đổi sang màu này được không?',
      type: 'text',
      createdAt: new Date(Date.now() - 3390000).toISOString(),
      status: 'read',
    },
  ];
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    userType: 'buyer',
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?u=1',
    orderId: 'ORD-9921',
    lastMessage: 'Mình muốn đổi sang màu này...',
    unreadCount: 2,
    isPinned: true,
    online: true,
    updatedAt: new Date().toISOString(),
    tags: ['VIP', 'Khiếu nại'],
  },
  {
    id: 'c2',
    userType: 'buyer',
    name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?u=2',
    orderId: 'ORD-1122',
    lastMessage: 'Cảm ơn shop nhé!',
    unreadCount: 0,
    isPinned: false,
    online: false,
    updatedAt: new Date(Date.now() - 100000).toISOString(),
  },
  {
    id: 'c3',
    userType: 'admin',
    name: 'Support Admin 01',
    avatar: 'https://github.com/shadcn.png',
    ticketId: 'TCK-8821',
    lastMessage: 'Vui lòng xác minh giấy tờ.',
    unreadCount: 1,
    isPinned: true,
    online: true,
    updatedAt: new Date(Date.now() - 500000).toISOString(),
  },
  {
    id: 'c4',
    userType: 'buyer',
    name: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?u=3',
    orderId: 'ORD-3321',
    lastMessage: 'Hàng bị vỡ rồi shop ơi',
    unreadCount: 5,
    isPinned: false,
    online: false,
    updatedAt: new Date(Date.now() - 800000).toISOString(),
  },
];

// -----------------------------------------------------------------------------
// 3. COMPONENTS
// -----------------------------------------------------------------------------

// --- 3.1 Media Viewer Modal ---
const MediaViewer = ({
  src,
  type,
  isOpen,
  onClose,
}: {
  src: string;
  type: 'image' | 'video';
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90 border-none sm:rounded-xl">
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          {type === 'image' ? (
            <Image
              width={100}
              height={100}
              src={src}
              alt="Full view"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video src={src} controls className="max-w-full max-h-full" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- 3.2 Message Bubble ---
const MessageBubble = ({
  message,
  isMe,
}: {
  message: ChatMessage;
  isMe: boolean;
}) => {
  const [viewMedia, setViewMedia] = useState(false);

  return (
    <div
      className={cn(
        'flex w-full mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300',
        isMe ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'flex max-w-[70%] flex-col',
          isMe ? 'items-end' : 'items-start',
        )}
      >
        {/* System Message Special Case */}
        {message.type === 'system' && (
          <div className="w-full flex justify-center my-2">
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              {message.content}
            </span>
          </div>
        )}

        {/* Normal Messages */}
        {message.type !== 'system' && (
          <>
            <div
              className={cn(
                'px-4 py-2 shadow-sm relative group',
                message.type === 'text'
                  ? 'rounded-2xl'
                  : 'rounded-xl overflow-hidden p-0',
                isMe
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none',
              )}
            >
              {/* Text */}
              {message.type === 'text' && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              )}

              {/* Image */}
              {message.type === 'image' && (
                <div
                  className="cursor-pointer"
                  onClick={() => setViewMedia(true)}
                >
                  <Image
                    width={100}
                    height={100}
                    src={message.content}
                    alt="attachment"
                    className="max-w-[200px] md:max-w-[300px] object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              )}

              {/* Video */}
              {message.type === 'video' && (
                <div
                  className="relative cursor-pointer bg-black"
                  onClick={() => setViewMedia(true)}
                >
                  <VideoIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 w-8 h-8" />
                  <video
                    src={message.content}
                    className="max-w-[250px] max-h-[200px]"
                  />
                </div>
              )}

              {/* Timestamp on hover */}
              <div
                className={cn(
                  'absolute bottom-0 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1 mx-2 text-white/80',
                  isMe
                    ? 'right-full mr-2 text-gray-400'
                    : 'left-full ml-2 text-gray-400',
                )}
              >
                {format(new Date(message.createdAt), 'HH:mm')}
              </div>
            </div>

            {/* Status Indicator (Only for me) */}
            {isMe && (
              <div className="flex justify-end mt-1 mr-1">
                {message.status === 'sent' && (
                  <Check className="w-3 h-3 text-gray-300" />
                )}
                {message.status === 'delivered' && (
                  <CheckCheck className="w-3 h-3 text-gray-300" />
                )}
                {message.status === 'read' && (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                )}
              </div>
            )}

            {/* Media Viewer Modal */}
            <MediaViewer
              isOpen={viewMedia}
              onClose={() => setViewMedia(false)}
              src={message.content}
              type={message.type === 'video' ? 'video' : 'image'}
            />
          </>
        )}
      </div>
    </div>
  );
};

// --- 3.3 Sidebar Item ---
const ConversationItem = ({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group relative',
        isActive
          ? 'bg-blue-50/80 border border-blue-100'
          : 'hover:bg-gray-50 border border-transparent',
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
          <AvatarImage src={conv.avatar} />
          <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {conv.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full ring-1 ring-white"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span
            className={cn(
              'font-medium truncate text-sm',
              isActive ? 'text-blue-700' : 'text-gray-900',
            )}
          >
            {conv.name}
          </span>
          <span className="text-[10px] text-gray-400 shrink-0">
            {format(new Date(conv.updatedAt), 'HH:mm')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          {conv.isTyping ? (
            <span className="text-xs text-blue-500 animate-pulse italic">
              Đang soạn tin...
            </span>
          ) : (
            <p
              className={cn(
                'text-xs truncate max-w-[140px]',
                conv.unreadCount > 0
                  ? 'font-semibold text-gray-800'
                  : 'text-gray-500',
              )}
            >
              {conv.userType === 'admin' && (
                <span className="text-xs font-bold text-orange-500 mr-1">
                  [Admin]
                </span>
              )}
              {conv.lastMessage}
            </p>
          )}
          {conv.unreadCount > 0 && (
            <Badge
              variant="default"
              className="h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 hover:bg-red-600 text-[10px] flex justify-center"
            >
              {conv.unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Pin Icon (Visible on hover) */}
      {conv.isPinned && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[12px] border-r-[12px] border-t-blue-500 border-r-transparent" />
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. MAIN PAGE LOGIC & LAYOUT
// -----------------------------------------------------------------------------

const msgSchema = yup.object().shape({
  message: yup.string().required(),
});

export default function SellerChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(
    MOCK_CONVERSATIONS[0].id,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'admin' | 'buyer'>(
    'all',
  );
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConvId),
    [conversations, activeConvId],
  );

  const { register, handleSubmit, reset, setFocus } = useForm({
    resolver: yupResolver(msgSchema),
  });

  // --- Effects ---

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    setIsLoadingMessages(true);
    // Simulate API Call
    setTimeout(() => {
      setMessages(generateMessages(activeConvId));
      setIsLoadingMessages(false);
      scrollToBottom();
    }, 400); // 400ms delay

    // Mark as read logic would go here
  }, [activeConvId]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Handlers ---

  const handleSendMessage = (data: { message: string }) => {
    if (!data.message.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'seller',
      content: data.message,
      type: 'text',
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    reset();
    setTimeout(scrollToBottom, 100);

    // Fake Realtime Reply
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, isTyping: true } : c)),
      );
    }, 1000);

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: Date.now().toString() + '_r',
        sender: activeConv?.userType || 'buyer',
        content: 'Cảm ơn shop đã phản hồi. Mình sẽ chờ thêm.',
        type: 'text',
        createdAt: new Date().toISOString(),
        status: 'read',
      };
      setMessages((prev) => {
        const updated = [...prev, replyMsg];
        // Update last message status of previous sent message
        updated[updated.length - 2].status = 'read';
        return updated;
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                isTyping: false,
                lastMessage: 'Cảm ơn shop đã phản hồi...',
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
      setTimeout(scrollToBottom, 100);
    }, 3000);
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage({ message: text });
  };

  const filteredConversations = conversations.filter((c) => {
    if (filter === 'unread') return c.unreadCount > 0;
    if (filter === 'admin') return c.userType === 'admin';
    if (filter === 'buyer') return c.userType === 'buyer';
    return true;
  });

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* ================= COLUMN 1: SIDEBAR ================= */}
      <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50/50">
        {/* Header Sidebar */}
        <div className="p-4 pb-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">
            Tin nhắn
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm khách hàng, Mã đơn..."
              className="pl-9 bg-white shadow-sm border-gray-200 rounded-xl"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Badge
              variant={filter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter('all')}
            >
              Tất cả
            </Badge>
            <Badge
              variant={filter === 'unread' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter('unread')}
            >
              Chưa đọc
            </Badge>
            <Badge
              variant={filter === 'buyer' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter('buyer')}
            >
              Khách
            </Badge>
            <Badge
              variant={filter === 'admin' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilter('admin')}
            >
              Admin
            </Badge>
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <User className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm">Không tìm thấy hội thoại</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={activeConvId === conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ================= COLUMN 2: MAIN CHAT ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {activeConv ? (
          <>
            {/* 2.1 Header */}
            <div className="h-16 border-b flex items-center justify-between px-4 bg-white z-10 shadow-sm/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activeConv.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 leading-none">
                      {activeConv.name}
                    </h3>
                    {activeConv.userType === 'admin' && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 px-1"
                      >
                        Support
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        activeConv.online ? 'bg-green-500' : 'bg-gray-300',
                      )}
                    ></span>
                    <span className="text-xs text-gray-500">
                      {activeConv.online
                        ? 'Đang hoạt động'
                        : 'Truy cập 15p trước'}
                    </span>
                    {activeConv.orderId && (
                      <span className="text-xs text-blue-600 ml-2 font-medium bg-blue-50 px-1 rounded cursor-pointer hover:underline">
                        #{activeConv.orderId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowInfoPanel(!showInfoPanel)}
                      >
                        <Layout className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Thông tin đơn hàng</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* 2.2 Messages Area */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="space-y-4 p-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex gap-2 max-w-[60%]',
                          i % 2 === 0 ? 'ml-auto flex-row-reverse' : '',
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-10 w-full rounded-xl bg-gray-200 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pb-4">
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isMe={msg.sender === 'seller'}
                      />
                    ))}

                    {/* Typing Indicator */}
                    {activeConv.isTyping && (
                      <div className="flex items-end gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={activeConv.avatar} />
                        </Avatar>
                        <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* 2.3 Input Area */}
              <div className="p-4 bg-white border-t z-10">
                {/* Quick Replies */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_REPLIES.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickReply(reply)}
                      className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                <div className="flex items-end gap-2 bg-white">
                  <div className="flex gap-1 mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-600 rounded-full h-8 w-8"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-600 rounded-full h-8 w-8"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex-1 relative">
                    <form onSubmit={handleSubmit(handleSendMessage)}>
                      <Textarea
                        placeholder="Nhập tin nhắn..."
                        className="min-h-[44px] max-h-[120px] py-3 pr-10 resize-none rounded-2xl border-gray-200 focus-visible:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(handleSendMessage)();
                          }
                        }}
                        {...register('message')}
                      />
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="absolute right-2 bottom-1.5 h-8 w-8 text-gray-400 hover:text-yellow-500"
                      >
                        <Smile className="w-5 h-5" />
                      </Button>
                    </form>
                  </div>
                  <Button
                    onClick={handleSubmit(handleSendMessage)}
                    size="icon"
                    className="rounded-full h-11 w-11 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0 mb-[1px]"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full opacity-50"></div>
            </div>
            <p>Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>

      {/* ================= COLUMN 3: INFO PANEL ================= */}
      {showInfoPanel && activeConv && (
        <div className="w-[340px] border-l border-gray-200 bg-white flex flex-col h-full animate-in slide-in-from-right duration-300 shadow-xl z-20">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-semibold text-gray-800">Thông tin</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowInfoPanel(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-5 flex flex-col items-center text-center border-b border-gray-100">
              <Avatar className="w-20 h-20 mb-3 border-4 border-gray-50">
                <AvatarImage src={activeConv.avatar} />
                <AvatarFallback className="text-xl">A</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg text-gray-900">
                {activeConv.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                {activeConv.userType === 'buyer'
                  ? 'Khách hàng thân thiết'
                  : 'Nhân viên hỗ trợ'}
              </p>

              <div className="flex gap-4 w-full justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full flex-1 gap-2"
                >
                  <User className="w-4 h-4" /> Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full flex-1 gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Info className="w-4 h-4" /> Báo xấu
                </Button>
              </div>
            </div>

            {activeConv.userType === 'buyer' ? (
              /* Buyer Info View */
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Đơn hàng hiện tại
                  </h4>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-blue-700 text-sm">
                        #{activeConv.orderId}
                      </span>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-[10px]">
                        Đang vận chuyển
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-white rounded-md border flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="line-clamp-2 font-medium">
                          Áo thun cotton cao cấp form rộng unisex
                        </p>
                        <p>Phân loại: Đen, XL</p>
                        <p className="font-bold text-gray-900">199.000đ</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>0909 *** 888</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="line-clamp-2">
                        123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Admin/Support Info View */
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Ticket Support
                  </h4>
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-orange-700">
                        #{activeConv.ticketId}
                      </span>
                      <span className="text-xs text-orange-600 font-medium">
                        High Priority
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Yêu cầu xác minh giấy tờ kinh doanh shop.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">SLA:</span>
                    <span className="font-mono font-medium text-red-500">
                      2h 15m remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full w-[70%]"></div>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-2" />

            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Ghi chú
              </h4>
              <Textarea
                placeholder="Thêm ghi chú nội bộ..."
                className="text-sm bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-400"
              />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
