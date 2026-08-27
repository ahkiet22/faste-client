"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { CongratulationsCard } from './partials/congratulations-card';
import { DashboardHeader } from './partials/dashboard-header';
import { MetricCard } from './partials/metric-card';
import { RevenueChart } from './partials/revenue-chart';
import { ReportDateRange } from '@/services/report.service';
import {
  useGetSellerOverview,
  useGetSellerSalesTrend,
  useGetSellerTopProducts,
} from '@/hooks/api/queries/useReportQueries';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<ReportDateRange>('last7days');

  const { data: overview, isLoading: isLoadingOverview } = useGetSellerOverview({ dateRange });
  const { data: trend, isLoading: isLoadingTrend } = useGetSellerSalesTrend({ dateRange });
  const { data: topProducts, isLoading: isLoadingTopProducts } = useGetSellerTopProducts({ dateRange, limit: 5 });

  return (
    <div className="min-h-screen">
      <div className='mb-6'>
        <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <main className="space-y-6">
        {/* Top Row - Congratulations and Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CongratulationsCard />

          <MetricCard
            label="sellercenter.dashboard.metrics.mrr"
            value={isLoadingOverview ? '...' : `$${(overview?.totalRevenue || 0).toLocaleString()}`}
          />

          <MetricCard
            label="sellercenter.dashboard.metrics.orders"
            value={isLoadingOverview ? '...' : (overview?.totalOrders || 0).toLocaleString()}
          />

          <MetricCard
            label="sellercenter.dashboard.metrics.productsSold"
            value={isLoadingOverview ? '...' : (overview?.totalProductsSold || 0).toLocaleString()}
          />
        </div>

        {/* Bottom Row - Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart 
              data={trend?.data || []} 
              totalRevenue={overview?.totalRevenue || 0} 
            />
          </div>

          <div>
            <div className="bg-card rounded-xl border shadow-sm h-full p-6">
              <h3 className="font-medium text-lg mb-4">{t('sellercenter.dashboard.metrics.topProducts', 'Top Products')}</h3>
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
        </div>
      </main>
    </div>
  );
}
