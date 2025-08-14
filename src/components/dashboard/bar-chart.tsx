// components/dashboard/bar-chart.tsx
"use client";

import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
}

export function BarChart({ data, colors = ['#3B82F6'], height = 80 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE4E8" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          stroke="#ACB5BB" 
          fontSize={10} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          stroke="#ACB5BB" 
          fontSize={10} 
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
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}