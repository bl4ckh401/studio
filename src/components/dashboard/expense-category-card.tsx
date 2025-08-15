
"use client";

import { InfoCard } from "@/components/dashboard/info-card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowDown, InfoIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ExpenseCategoryData {
  name: string;
  value: number;
  color: string;
}

const dummyExpenseData: ExpenseCategoryData[] = [
  { name: 'Subscriptions', value: 40.1, color: '#31B099' },
  { name: 'Taxes', value: 25.0, color: '#E7854D' },
  { name: 'Shopping', value: 6.1, color: '#C65468' },
  { name: 'Others', value: 19.2, color: '#4D81E7' },
];

const totalValue = dummyExpenseData.reduce((sum, item) => sum + item.value, 0);


export function ExpenseCategoryCard() {
  return (
    <div className="bg-white dark:bg-[#2C3542] rounded-2xl p-6 flex flex-col gap-6 w-full lg:w-full lg:h-auto">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-1.5">
          <h2 className="font-manrope text-lg font-semibold text-[#1A1C1E] dark:text-white tracking-[-0.02em]">Expense Category</h2>
          <InfoIcon className="h-4.5 w-4.5 text-[#6C7278] dark:text-[#A2A6AA]" />
        </div>
        <div className="flex items-center gap-1.5 text-[#ACB5BB] dark:text-[#A2A6AA] font-manrope text-sm font-medium tracking-[-0.02em]">
            Monthly
            <ArrowDown className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 lg:gap-[45px] w-full">
        <div className="w-[190px] h-[190px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dummyExpenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {dummyExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-center bg-white dark:bg-card rounded-full w-[115px] h-[115px] flex flex-col justify-center items-center shadow-[0px_0px_24px_rgba(0,0,0,0.09)]">
                <p className="text-2xl font-bold text-secondary-500 dark:text-white tracking-[-0.03em]">100%</p>
                <p className="text-xs font-medium text-secondary-400 dark:text-gray-400">Data Recorded</p>
              </div>
           </div>
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-auto">
            {dummyExpenseData.map((item, index) => (
                <div key={index} className="flex justify-between items-center w-full lg:w-[271px]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                        <span className="text-sm font-semibold text-[#6C7278] dark:text-[#A2A6AA]">{item.name} ({item.value}%)</span>
                    </div>
                    <span className="text-sm font-bold text-[#1A1C1E] dark:text-white">${(item.value * 125).toLocaleString('en-US', {minimumFractionDigits: 3, maximumFractionDigits: 3}).replace(/,/g, '.')}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

