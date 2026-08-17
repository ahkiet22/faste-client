'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderListSkeletonProps {
  rowCount?: number;
}

export function OrderListSkeleton({ rowCount = 5 }: OrderListSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="w-[100px]"><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-28" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <TableRow key={index}>
                {/* Order ID */}
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                {/* Created At */}
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                {/* Shop Name */}
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                {/* Product Items */}
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                {/* Total Price */}
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                {/* Payment Method */}
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                {/* Status Badge */}
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                {/* Action Button */}
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-16 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List Skeleton */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <div className="pt-2">
                <Skeleton className="h-px w-full my-2" />
                <div className="flex justify-between items-center py-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}