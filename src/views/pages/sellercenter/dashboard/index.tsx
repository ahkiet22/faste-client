import { CongratulationsCard } from './partials/congratulations-card';
import { DashboardHeader } from './partials/dashboard-header';
import { MetricCard } from './partials/metric-card';
import { ReturningRateChart } from './partials/returning-rate-chart';
import { RevenueChart } from './partials/revenue-chart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className='mb-6'>
        <DashboardHeader />
      </div>

      <main className="space-y-6">
        {/* Top Row - Congratulations and Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CongratulationsCard />

          <MetricCard
            label="sellercenter.dashboard.metrics.mrr"
            value="$34.1K"
            change="+61%"
            trend="up"
          />

          <MetricCard
            label="sellercenter.dashboard.metrics.users"
            value="500.1K"
            change="+19.2%"
            trend="up"
          />

          <MetricCard
            label="sellercenter.dashboard.metrics.userGrowth"
            value="11.3%"
            change="-1.2%"
            trend="down"
          />
        </div>

        {/* Bottom Row - Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>

          <div>
            <ReturningRateChart />
          </div>
        </div>
      </main>
    </div>
  );
}
