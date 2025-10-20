'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Search, Star } from 'lucide-react';

/**
 * Shop List Page Component
 *
 * Displays a grid of seller shops with:
 * - Responsive grid layout (4 cols desktop, 2 tablet, 1 mobile)
 * - Search functionality (filter by shop name)
 * - Sort dropdown (by name, rating, products)
 * - Client-side pagination
 * - Shop cards with logo, name, description, rating, product count
 * - Click to view shop details at /shop/[slug]
 *
 * TODO: Replace MOCK_SHOPS with API call to fetch shops
 * Example: const shops = await fetch('/api/shops').then(r => r.json())
 */

interface Shop {
  id: number;
  slug: string;
  name: string;
  description: string;
  rating: number;
  totalProducts: number;
  logo: string;
  category?: string;
}

// Mock shop data - replace with API call in production
const MOCK_SHOPS: Shop[] = [
  {
    id: 1,
    slug: 'tech-hub-store',
    name: 'Tech Hub Store',
    description: 'Premium electronics and gadgets for tech enthusiasts',
    rating: 4.8,
    totalProducts: 256,
    logo: '/tech-store-logo.jpg',
    category: 'Electronics',
  },
  {
    id: 2,
    slug: 'fashion-forward',
    name: 'Fashion Forward',
    description: 'Latest trends in clothing, shoes, and accessories',
    rating: 4.6,
    totalProducts: 512,
    logo: '/fashion-store-logo.jpg',
    category: 'Fashion',
  },
  {
    id: 3,
    slug: 'home-comfort-co',
    name: 'Home Comfort Co',
    description: 'Quality furniture and home decor for every room',
    rating: 4.5,
    totalProducts: 189,
    logo: '/home-store-logo.jpg',
    category: 'Home',
  },
  {
    id: 4,
    slug: 'beauty-essentials',
    name: 'Beauty Essentials',
    description: 'Skincare, makeup, and beauty products from top brands',
    rating: 4.7,
    totalProducts: 342,
    logo: '/beauty-store-logo.jpg',
    category: 'Beauty',
  },
  {
    id: 5,
    slug: 'sports-gear-pro',
    name: 'Sports Gear Pro',
    description: 'Athletic equipment and sportswear for all activities',
    rating: 4.4,
    totalProducts: 278,
    logo: '/sports-store-logo.jpg',
    category: 'Sports',
  },
  {
    id: 6,
    slug: 'book-lovers-paradise',
    name: 'Book Lovers Paradise',
    description: 'Extensive collection of books across all genres',
    rating: 4.9,
    totalProducts: 1024,
    logo: '/book-store-logo.jpg',
    category: 'Books',
  },
  {
    id: 7,
    slug: 'kitchen-masters',
    name: 'Kitchen Masters',
    description: 'Professional and home kitchen equipment and cookware',
    rating: 4.3,
    totalProducts: 156,
    logo: '/kitchen-store-logo.jpg',
    category: 'Kitchen',
  },
  {
    id: 8,
    slug: 'pet-paradise',
    name: 'Pet Paradise',
    description: 'Everything your pets need - food, toys, and accessories',
    rating: 4.6,
    totalProducts: 423,
    logo: '/pet-store-logo.jpg',
    category: 'Pets',
  },
];

type SortOption = 'name-asc' | 'name-desc' | 'rating-high' | 'products-high';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 8;

  // Filter and sort shops
  const filteredAndSortedShops = useMemo(() => {
    const filtered = MOCK_SHOPS.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'products-high':
        filtered.sort((a, b) => b.totalProducts - a.totalProducts);
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedShops.length / shopsPerPage);
  const startIndex = (currentPage - 1) * shopsPerPage;
  const paginatedShops = filteredAndSortedShops.slice(
    startIndex,
    startIndex + shopsPerPage,
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Our Shops
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Discover amazing products from trusted sellers
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Sort Controls */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
                aria-label="Search shops"
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleSortChange('name-asc')}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('name-desc')}>
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange('rating-high')}
                >
                  Rating (High to Low)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange('products-high')}
                >
                  Most Products
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Shops Grid */}
          {paginatedShops.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {paginatedShops.map((shop) => (
                  <article key={shop.id}>
                    <Link href={`/shop/${shop.slug}`}>
                      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-105">
                        {/* Shop Logo */}
                        <div className="relative h-32 w-full overflow-hidden bg-muted flex items-center justify-center">
                          <Image
                            src={shop.logo || '/placeholder.svg'}
                            alt={`${shop.name} logo`}
                            width={100}
                            height={100}
                            className="object-contain"
                          />
                        </div>

                        <CardHeader className="pb-3">
                          {/* Shop Name */}
                          <h2 className="text-lg font-semibold text-card-foreground line-clamp-2">
                            {shop.name}
                          </h2>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-4">
                          {/* Description */}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {shop.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center justify-between border-t border-border pt-3">
                            {renderStars(shop.rating)}
                          </div>

                          {/* Product Count */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{shop.totalProducts} products</span>
                            {shop.category && (
                              <Badge variant="secondary">{shop.category}</Badge>
                            )}
                          </div>

                          {/* View Shop Button */}
                          <Button className="w-full mt-2" size="sm">
                            View Shop
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-9 w-9 p-0"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium text-foreground">
                No shops found
              </p>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  handleSortChange('name-asc');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
