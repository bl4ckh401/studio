
"use client";

import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { MetricCard } from "./metric-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ExpenseAnalysisCardProps {
  title: string;
  metric: string;
  percentageChange: string;
  timePeriod: string;
  changeType: 'increase' | 'decrease';
  data?: { name: string; expenses: number }[];
  loading?: boolean;
}

export function ExpenseAnalysisCard({ title, metric, percentageChange, timePeriod, changeType, data = [], loading = false }: ExpenseAnalysisCardProps) {
  const badgeBgColor = changeType === 'increase' ? 'bg-[#D6FBE6]' : 'bg-[#F9C6BF]';
  const badgeTextColor = changeType === 'increase' ? 'text-[#31B099]' : 'text-[#C65468]';
  const arrowIcon = changeType === 'increase' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />;
  const lineColor = changeType === 'increase' ? '#31B099' : '#C65468';
  const changeAmountColor = changeType === 'increase' ? 'text-[#31B099]' : 'text-[#C65468]';


  return (
    <div className="flex flex-col lg:flex-row items-start p-6 gap-9 bg-white dark:bg-[#2C3542] rounded-2xl w-full">
      <div className="flex flex-col items-start p-0 gap-4 w-full">
        <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
                <h3 className="font-manrope text-lg font-semibold tracking-[-0.02em] text-[#1A1C1E] dark:text-white">{title}</h3>
                <InfoIcon className="h-4.5 w-4.5 text-[#6C7278] dark:text-[#A2A6AA]" />
            </div>
             <div className="flex items-center gap-1.5 text-[#ACB5BB] dark:text-[#A2A6AA] font-manrope text-sm font-medium tracking-[-0.02em]">
                Monthly
                <ArrowDownIcon className="h-3.5 w-3.5" />
            </div>
        </div>

        <div className="flex flex-row items-start p-0 gap-4">
          <p className="text-4xl font-bold font-manrope text-[#1A1C1E] dark:text-white tracking-[-0.03em]">{metric}</p>
          <div className={`flex justify-center items-center px-1 py-0.5 ${badgeBgColor} rounded-md gap-1`}>
            {arrowIcon}
            <span className={`text-base font-semibold font-manrope ${badgeTextColor} tracking-[-0.02em]`}>{percentageChange}</span>
          </div>
        </div>
        
        {/* <div className="flex flex-row items-center p-0 gap-1 flex-wrap">
            <p className="text-base font-medium font-manrope text-[#1A1C1E] dark:text-white tracking-[-0.02em]">Expense increased by</p>
            <div className="flex justify-center items-center px-1 py-0.5 rounded-md">
              <span className={`text-base font-semibold font-manrope ${changeAmountColor} tracking-[-0.02em]`}>$1.456</span>
            </div>
             <p className="text-base font-medium font-manrope text-[#1A1C1E] dark:text-white tracking-[-0.02em]">{timePeriod}</p>
        </div> */}
      </div>

      <div className="w-full lg:w-[177px] h-[140px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-12 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={lineColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={lineColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE4E8" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#ACB5BB" fontSize={12} />
            <YAxis axisLine={false} tickLine={false} stroke="#ACB5BB" fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontFamily: 'Manrope',
                    color: 'var(--foreground)'
                }}
            />
            <Area type="monotone" dataKey="expenses" stroke={lineColor} strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" dot={{ r: 0 }} activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: lineColor }} />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
