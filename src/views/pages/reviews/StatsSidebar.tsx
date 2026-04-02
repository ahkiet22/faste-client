import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@iconify/react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

export const StatsSidebar = () => {
  // Mock Data Chart
  const dataDaily = [
    { name: 'T2', count: 12 },
    { name: 'T3', count: 19 },
    { name: 'T4', count: 8 },
    { name: 'T5', count: 22 },
    { name: 'T6', count: 15 },
    { name: 'T7', count: 30 },
    { name: 'CN', count: 25 },
  ];
  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-none border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-gray-700">
            Đánh giá chung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-bold text-gray-900">4.8</span>
            <div className="mb-1 text-yellow-400 flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Icon key={i} icon="ph:star-fill" width={16} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-500">{star}</span>
                <Icon icon="ph:star-fill" className="text-gray-300 w-3 h-3" />
                <Progress
                  value={star === 5 ? 80 : star === 4 ? 15 : 5}
                  className="h-1.5 flex-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-none border border-gray-200">
        <CardContent className="p-4 h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataDaily}>
              <XAxis
                dataKey="name"
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[2, 2, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
