'use client';

import { useState } from 'react';
import {
  ImageIcon,
  Video,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Edit,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadDate: string;
  thumbnail: string;
}

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export function MediaCard({
  item,
  isSelected,
  onToggleSelection,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={item.thumbnail || '/public/nftt-2.png'}
          alt={item.name}
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />

        {/* Overlay with checkbox and actions */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isHovered || isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelection}
              className="bg-background border-2"
            />
          </div>

          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-background/90 hover:bg-background"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Metadata
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div className="text-muted-foreground mt-0.5">{getTypeIcon()}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {item.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{item.size}</span>
              <span>•</span>
              <span>{item.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
