import { InfoCard } from "./info-card";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  metric: string;
  percentageChange?: string;
  changeType?: 'increase' | 'decrease';
  timePeriod?: string;
  children?: React.ReactNode;
}

export function MetricCard({ title, metric, percentageChange, changeType, timePeriod, children }: MetricCardProps) {
  return (
    <InfoCard title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <p className="font-manrope font-bold text-3xl lg:text-[36px] leading-[54px] tracking-[-0.03em] text-[#1A1C1E] dark:text-white">
            {metric}
          </p>
          {percentageChange && changeType && (
            <div className={cn(
              "flex items-center px-1 py-0.5 rounded-md gap-1",
              changeType === 'increase' ? 'bg-[#D6FBE6] text-[#31B099]' : 'bg-[#F9C6BF] text-[#C65468]'
            )}>
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              <span className="font-manrope font-semibold text-sm leading-[21px] tracking-[-0.02em]">
                {percentageChange}
              </span>
            </div>
          )}
        </div>
        {timePeriod && (
          <p className="font-manrope font-medium text-base leading-6 tracking-[-0.02em] text-[#1A1C1E] dark:text-[#ACB5BB]">
            VS {timePeriod}
          </p>
        )}
        {children}
      </div>
    </InfoCard>
  );
}