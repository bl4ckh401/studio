"use client";

import { InfoIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface IncomeAnalysisCardProps {
  title: string;
  metric: string;
  percentageChange: string;
  timePeriod: string;
  changeType: 'increase' | 'decrease';
  changeAmount: string;
}

const incomeData = [
  { name: 'Jan', income: 8000 },
  { name: 'Feb', income: 6000 },
  { name: 'Mar', income: 9000 },
];

export function IncomeAnalysisCard({ title, metric, percentageChange, timePeriod, changeType, changeAmount }: IncomeAnalysisCardProps) {
  const badgeBgColor = changeType === 'increase' ? 'bg-[#D6FBE6]' : 'bg-red-100';
  const badgeTextColor = changeType === 'increase' ? 'text-[#31B099]' : 'text-red-500';
  const arrowIcon = changeType === 'increase' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />;
  const changeAmountColor = changeType === 'increase' ? 'text-[#31B099]' : 'text-red-500';

  return (
    <div className="flex flex-col lg:flex-row items-start p-6 gap-9 bg-white dark:bg-[#2C3542] rounded-2xl w-full">
      <div className="flex flex-col items-start p-0 gap-4 w-full lg:w-[292px]">
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
        
        {/* <div className="flex flex-row items-center p-0 gap-1">
            <p className="text-base font-medium font-manrope text-[#1A1C1E] dark:text-white tracking-[-0.02em]">Income increased by</p>
            <div className="flex justify-center items-center px-1 py-0.5 rounded-md">
              <span className={`text-base font-semibold font-manrope ${changeAmountColor} tracking-[-0.02em]`}>{changeAmount}</span>
            </div>
             <p className="text-base font-medium font-manrope text-[#1A1C1E] dark:text-white tracking-[-0.02em]">{timePeriod}</p>
        </div> */}
      </div>

      <div className="w-[180px] h-[143px] hidden lg:block">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={incomeData}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCE4E8" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#ACB5BB" style={{ fontSize: '12px', fontFamily: 'Manrope' }} />
            <YAxis axisLine={false} tickLine={false} stroke="#ACB5BB" style={{ fontSize: '12px', fontFamily: 'Manrope' }} tickFormatter={(value) => `${value/1000}k`} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontFamily: 'Manrope'
                }}
            />
            <Bar dataKey="income" fill="#E7854D" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
