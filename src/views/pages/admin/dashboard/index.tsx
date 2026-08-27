"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { MetricCard } from '@/views/pages/sellercenter/dashboard/partials/metric-card';
import { RevenueChart } from '@/views/pages/sellercenter/dashboard/partials/revenue-chart';
import { DashboardHeader } from '@/views/pages/sellercenter/dashboard/partials/dashboard-header';
import { ReportDateRange } from '@/services/report.service';
import {
  useGetAdminOverview,
  useGetAdminSalesTrend,
  useGetAdminTopProducts,
  useGetAdminTopSellers,
} from '@/hooks/api/queries/useReportQueries';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<ReportDateRange>('last7days');

  const { data: overview, isLoading: isLoadingOverview } = useGetAdminOverview({ dateRange });
  const { data: trend } = useGetAdminSalesTrend({ dateRange });
  const { data: topProducts, isLoading: isLoadingTopProducts } = useGetAdminTopProducts({ dateRange, limit: 5 });
  const { data: topSellers, isLoading: isLoadingTopSellers } = useGetAdminTopSellers({ dateRange, limit: 5 });

  return (
    <div className="min-h-screen">
      <div className='mb-6'>
        <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <main className="space-y-6">
        {/* Top Row - Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={isLoadingOverview ? '...' : `$${(overview?.totalRevenue || 0).toLocaleString()}`}
          />

          <MetricCard
            label="Orders"
            value={isLoadingOverview ? '...' : (overview?.totalOrders || 0).toLocaleString()}
          />

          <MetricCard
            label="Customers"
            value={isLoadingOverview ? '...' : (overview?.totalCustomers || 0).toLocaleString()}
          />

          <MetricCard
            label="Sellers"
            value={isLoadingOverview ? '...' : (overview?.totalSellers || 0).toLocaleString()}
          />
        </div>

        {/* Middle Row - Charts */}
        <div className="grid gap-6">
          <RevenueChart 
            data={trend?.data || []} 
            totalRevenue={overview?.totalRevenue || 0} 
          />
        </div>

        {/* Bottom Row - Top Items */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Sellers */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-medium text-lg mb-4">Top Sellers</h3>
            {isLoadingTopSellers ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : topSellers?.data && topSellers.data.length > 0 ? (
              <div className="space-y-4">
                {topSellers.data.map((seller) => (
                  <div key={seller.shopId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden relative">
                      {seller.logo ? (
                        <Image src={seller.logo} alt={seller.shopName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{seller.shopName}</p>
                      <p className="text-xs text-muted-foreground">{seller.totalOrders} orders</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${seller.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">{t('common.noData', 'No data available')}</div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-medium text-lg mb-4">Top Products</h3>
            {isLoadingTopProducts ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : topProducts?.data && topProducts.data.length > 0 ? (
              <div className="space-y-4">
                {topProducts.data.map((product) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.productName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${product.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">{t('common.noData', 'No data available')}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
