import { LucideIcon, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

interface ActivityItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  date: string;
}

export function ActivityItem({ icon, title, subtitle, amount, date }: ActivityItemProps) {
  const renderIcon = () => {
    if (icon) {
      return icon;
    }
    switch (subtitle.toLowerCase()) {
      case 'receive':
        return <ArrowDown className="h-6 w-6 text-green-500" />;
      case 'subscriptions':
        return <DollarSign className="h-6 w-6 text-red-500" />;
      case 'transfer':
         return <ArrowUp className="h-6 w-6 text-gray-500" />;
      default:
        return <DollarSign className="h-6 w-6 text-gray-400" />;
    }
  };


  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#F4F4F7] dark:bg-[#222A35] rounded-full flex items-center justify-center w-13 h-13">
           {renderIcon()}
        </div>
        <div className="flex flex-col items-start">
          <span className="font-manrope text-base font-semibold text-[#1A1C1E] dark:text-white">{title}</span>
          <span className="font-manrope text-sm font-medium text-[#ACB5BB] dark:text-[#A2A6AA]">{subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-manrope text-base font-semibold text-[#1A1C1E] dark:text-white">{amount}</span>
        <span className="font-manrope text-sm font-medium text-[#ACB5BB] dark:text-[#A2A6AA]">{date}</span>
      </div>
    </div>
  );
}
