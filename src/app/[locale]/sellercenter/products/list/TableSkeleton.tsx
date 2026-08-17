'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  rowCount?: number;
}

export function TableSkeleton({ rowCount = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full border rounded-xl overflow-hidden bg-white shadow-sm">
      <Table>
        {/* Table Header */}
        <TableHeader className="bg-gray-50/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Skeleton className="h-4 w-4 rounded mx-auto" />
            </TableHead>
            <TableHead className="w-16">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="min-w-[200px]">
              <Skeleton className="h-4 w-28" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-4 w-14 mx-auto" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="text-right w-16">
              <Skeleton className="h-4 w-10 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body Rows */}
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              {/* Checkbox */}
              <TableCell className="text-center">
                <Skeleton className="h-4 w-4 rounded mx-auto" />
              </TableCell>

              {/* Product Image */}
              <TableCell>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </TableCell>

              {/* Product Name & Slug */}
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </TableCell>

              {/* Price */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Status Badge */}
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>

              {/* SKU Count */}
              <TableCell className="text-center">
                <Skeleton className="h-5 w-12 rounded-md mx-auto" />
              </TableCell>

              {/* Published Date */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Action Button */}
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}