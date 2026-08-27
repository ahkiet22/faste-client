"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';
import { ReportDateRange } from '@/services/report.service';

interface DashboardHeaderProps {
  dateRange?: ReportDateRange;
  setDateRange?: (range: ReportDateRange) => void;
}

export function DashboardHeader({ dateRange, setDateRange }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-card rounded-2xl">
      <div className="container mx-auto flex items-center justify-between p-6">
        <h1 className="text-2xl font-semibold text-balance">
          {t('sellercenter.common.ecommerceDashboard')}
        </h1>

        <div className="flex items-center gap-3">
          {setDateRange && (
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as ReportDateRange)}
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
            </select>
          )}

          <Button variant="default" size="default" className="gap-2">
            <Download className="h-4 w-4" />
            {t('sellercenter.common.download')}
          </Button>
        </div>
      </div>
    </header>
  );
}
