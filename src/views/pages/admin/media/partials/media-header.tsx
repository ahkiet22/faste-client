'use client';

import { Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MediaHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  selectedCount: number;
}

export function MediaHeader({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  selectedCount,
}: MediaHeaderProps) {
  return (
    <header className="border-b border-border px-6 py-4 bg-white dark:bg-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 border border-gray-400"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {filterType === 'all' ? 'All Types' : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onFilterChange('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('images')}>
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('videos')}>
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange('documents')}>
                Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
