import { LucideIcon, DollarSign, ArrowUp, ArrowDown } from "lucide-react";

interface ActivityItemProps {
  icon?: React.ReactNode; // Can accept a custom icon component or element
  title: string;
  subtitle: string;
  amount: string;
  date: string;
}

export function ActivityItem({ icon, title, subtitle, amount, date }: ActivityItemProps) {
  // Determine icon based on subtitle or provide a default/placeholder
  const renderIcon = () => {
    if (icon) {
      return icon;
    }
    // Use Lucide React icons based on subtitle or a default
    switch (subtitle) {
      case 'Receive':
        return <DollarSign className="h-6 w-6 text-green-500" />;
      case 'Subscriptions':
        return <DollarSign className="h-6 w-6 text-red-500" />; // Using DollarSign as a generic placeholder
      case 'Transfer':
         return <DollarSign className="h-6 w-6 text-gray-500" />; // Using DollarSign as a generic placeholder
      default:
        return <div className="h-6 w-6 bg-gray-200 rounded-full"></div>; // Generic placeholder
    }
  };


  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-[12px]">
        <div className="p-2 bg-[#F4F4F7] dark:bg-[#2C3542] rounded-[100px] flex items-center justify-center w-[52px] h-[52px]">
           {renderIcon()}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <span className="font-manrope text-base font-semibold text-[#1A1C1E] dark:text-white tracking-[-0.02em]">{title}</span>
          <span className="font-manrope text-sm font-medium text-[#ACB5BB] dark:text-[#A2A6AA] tracking-[-0.02em]">{subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-manrope text-base font-semibold text-[#1A1C1E] dark:text-white tracking-[-0.02em]">{amount}</span>
        <span className="font-manrope text-sm font-medium text-[#ACB5BB] dark:text-[#A2A6AA] tracking-[-0.02em]">{date}</span>
      </div>
    </div>
  );
}