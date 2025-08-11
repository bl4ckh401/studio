"use client";

import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { MetricCard } from "./metric-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseAnalysisCardProps {
  title: string;
  metric: string;
  percentageChange: string;
  timePeriod: string;
  changeType: 'increase' | 'decrease';
}

// Dummy data for the chart
const expenseData = [
  { name: 'Jan', expenses: 4000 },
  { name: 'Feb', expenses: 3000 },
  { name: 'Mar', expenses: 5000 },
  { name: 'Apr', expenses: 4500 },
  { name: 'May', expenses: 6000 },
  { name: 'Jun', expenses: 5500 },
];

export function ExpenseAnalysisCard({ title, metric, percentageChange, timePeriod, changeType }: ExpenseAnalysisCardProps) {
  const badgeBgColor = changeType === 'increase' ? 'bg-[#D6FBE6]' : 'bg-[#F9C6BF]';
  const badgeTextColor = changeType === 'increase' ? 'text-[#31B099]' : 'text-[#C65468]';
  const arrowIcon = changeType === 'increase' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />;
  const lineColor = '#C65468'; // Red color for expense chart

  return (
    <div className="bg-white dark:bg-[#2C3542] rounded-2xl p-6 flex flex-col gap-9">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <h3 className="font-manrope text-lg font-semibold tracking-[-0.02em] text-[#1A1C1E] dark:text-white">{title}</h3>
          <InfoIcon className="h-4 w-4 text-[#6C7278] dark:text-[#A2A6AA]" />
        </div>
        {/* Dropdown Placeholder */}
        <div className="flex items-center gap-1.5 text-[#ACB5BB] dark:text-[#A2A6AA] font-manrope text-sm font-medium tracking-[-0.02em]">
            Monthly
            <ArrowDownIcon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="font-manrope text-4xl font-bold tracking-[-0.03em] text-[#1A1C1E] dark:text-white">{metric}</div>
          <div className={`flex items-center px-1 py-0.5 ${badgeBgColor} rounded-md text-xs font-semibold ${badgeTextColor}`}>
              {arrowIcon} {percentageChange}
          </div>
        </div>
        <div className="font-manrope text-base font-medium tracking-[-0.02em] text-[#1A1C1E] dark:text-white">
            Expense increased by <span className={`${badgeTextColor}`}>$1.456</span> {timePeriod}
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ width: '100%', height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={expenseData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE4E8" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#ACB5BB" fontSize={12} />
            <YAxis axisLine={false} tickLine={false} stroke="#ACB5BB" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip />
            <Line type="monotone" dataKey="expenses" stroke={lineColor} strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}