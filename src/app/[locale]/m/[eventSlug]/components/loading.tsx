// app/m/[eventSlug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Skeleton */}
        <div className="h-64 md:h-80 bg-gray-300 rounded-lg animate-pulse mb-6"></div>
        
        {/* Countdown Skeleton */}
        <div className="h-20 bg-gray-300 rounded-lg animate-pulse mb-6"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="h-96 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}