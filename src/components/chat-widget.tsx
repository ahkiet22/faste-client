'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Ấn Vật Catsky Fo...',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    lastMessage: 'Hi there! Need an upd...',
    time: '15:46',
  },
  {
    id: '2',
    name: '89gunda...',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    lastMessage: 'HUY NGANG = KH...',
    time: 'Ngày hôm qua',
    unread: true,
  },
  {
    id: '3',
    name: 'PHONG VU Digit...',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    lastMessage: '[Evaluation card] Dân...',
    time: '20/09',
  },
  {
    id: '4',
    name: 'NEWSEVEN Offi...',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    lastMessage: '[Dân nhân]',
    time: '19/06',
  },
  {
    id: '5',
    name: 'Ram Laptop - Q...',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    lastMessage: 'đã thời cơ để yêu di ạ...',
    time: '16/06',
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-40 transition-transform duration-300 ease-out scale-100">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open chat"
        >
          <div
            className={`transition-all duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </div>
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-full max-w-lg md:max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden flex flex-col h-96 md:h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 rounded-lg p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Conversation List */}
              <div className="w-full md:w-64 border-r border-gray-200 dark:border-slate-800 flex flex-col">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 dark:border-slate-800">
                  <input
                    type="text"
                    placeholder="Tìm theo tên"
                    className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-900 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Conversations */}
                <ScrollArea className="flex-1">
                  <div className="space-y-1 p-2">
                    {mockConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`w-full p-3 rounded-lg transition-colors text-left hover:bg-gray-100 dark:hover:bg-slate-900 ${
                          selectedConversation === conversation.id
                            ? 'bg-blue-50 dark:bg-slate-900'
                            : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={conversation.avatar || '/placeholder.svg'}
                                alt={conversation.name}
                              />
                              <AvatarFallback>
                                {conversation.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.unread && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                1
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">
                                {conversation.name}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {conversation.time}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Welcome Screen / Chat Area */}
              <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-6 animate-in fade-in duration-500">
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20"></div>
                      <div className="relative bg-white dark:bg-slate-950 rounded-full p-6 shadow-lg">
                        <MessageCircle className="w-12 h-12 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Chào mừng bạn đến với FastE Chat!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start chatting with our sellers now!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
