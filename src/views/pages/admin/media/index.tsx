'use client';

import { useState } from 'react';
import { MediaGrid } from './partials/media-grid';
import { UploadModal } from './partials/upload-modal';
import { MediaHeader } from './partials/media-header';
import { MediaSidebar } from './partials/media-sidebar';

export default function MediaLibraryPage() {
  const [selectedView, setSelectedView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  return (
    <div className="dark flex h-screen bg-background">
      <MediaSidebar
        selectedView={selectedView}
        onViewChange={setSelectedView}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <MediaHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          selectedCount={selectedItems.size}
        />

        <MediaGrid
          view={selectedView}
          searchQuery={searchQuery}
          filterType={filterType}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
        />
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
