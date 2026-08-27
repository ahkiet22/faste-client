"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslation } from "react-i18next"
import { SalesTrendItem } from "@/services/report.service"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
}

interface RevenueChartProps {
  data?: SalesTrendItem[];
  totalRevenue?: number;
}

export function RevenueChart({ data = [], totalRevenue = 0 }: RevenueChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{t('sellercenter.dashboard.metrics.mrr', 'Total Revenue')}</CardTitle>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('sellercenter.dashboard.metrics.mrr', 'Revenue')}</p>
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            {t('common.noData', 'No data available')}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                  className="text-xs"
                />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
