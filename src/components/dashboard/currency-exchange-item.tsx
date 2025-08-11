import Image from 'next/image';
import { ChevronDownIcon } from "lucide-react";

interface CurrencyExchangeItemProps {
  flagIcon: React.ReactNode; // Placeholder for flag icon
  currencyName: string;
  exchangeRate: string;
  currencyCode: string;
}

export function CurrencyExchangeItem({ flagIcon, currencyName, exchangeRate, currencyCode }: CurrencyExchangeItemProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
             {flagIcon} {/* Placeholder for flag icon */}
        </div>
        <span className="font-manrope font-bold text-base tracking-[-0.02em] text-[#1A1C1E] dark:text-white">
          {currencyName}
        </span>
      </div>
      <div className="flex items-baseline gap-4">
         <span className="font-manrope font-bold text-base tracking-[-0.02em] text-[#1A1C1E] dark:text-white text-right">
           {exchangeRate}
         </span>
         <span className="font-manrope font-bold text-base tracking-[-0.02em] text-[#ACB5BB] dark:text-[#6C7278] text-right">
           {currencyCode}
         </span>
      </div>
    </div>
  );
}