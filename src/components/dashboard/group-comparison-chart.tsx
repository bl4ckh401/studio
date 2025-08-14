// components/dashboard/group-comparison-chart.tsx
"use client";

import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GroupComparisonChartProps {
  groups: {
    id: number;
    name: string;
    contributions: number;
    expenses: number;
  }[];
}

export function GroupComparisonChart({ groups }: GroupComparisonChartProps) {
  const chartData = groups.map(group => ({
    name: group.name,
    contributions: group.contributions,
    expenses: group.expenses
  }));

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg font-bold">Group Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE4E8" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                stroke="#ACB5BB" 
                fontSize={12} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                stroke="#ACB5BB" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #EDF1F3',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#1A1C1E',
                }}
                formatter={(value) => [`$${value}`, 'Amount']}
              />
              <Legend 
                iconType="circle" 
                iconSize={10}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
              <Bar 
                dataKey="contributions" 
                name="Contributions" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]} 
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}