"use client";

import { InfoCard } from "@/components/dashboard/info-card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ExpenseCategoryData {
  name: string;
  value: number;
}

const dummyExpenseData: ExpenseCategoryData[] = [
  { name: 'Subscriptions', value: 400 },
  { name: 'Taxes', value: 300 },
  { name: 'Shopping', value: 300 },
  { name: 'Others', value: 200 },
];

// Define colors for each category - adapt these to your design
const COLORS = ["#31B099", "#E7854D", "#C65468", "#4D81E7"];

export function ExpenseCategoryCard() {
  return (
    <InfoCard title="Expense Category">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dummyExpenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                
                  return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {dummyExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {/* Optional: You can customize the tooltip content */}
            </PieChart>
          </ResponsiveContainer>

        </div>
        <div className="w-full md:w-1/2">
          <Legend
             payload={dummyExpenseData.map((entry, index) => ({
                id: entry.name,
                value: `${entry.name} (${((entry.value / dummyExpenseData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                type: "square",
                color: COLORS[index % COLORS.length],
             }))}
             layout="vertical"
             align="left"
             verticalAlign="middle"
             wrapperStyle={{ fontSize: '14px' }}
             formatter={(value, entry) => {
                return (
                   <span className="font-manrope font-semibold text-sm text-[#6C7278] dark:text-[#A2A6AA]">
                      {value}
                   </span>
                );
             }}
          />
        </div>
      </div>
    </InfoCard>
  );
}