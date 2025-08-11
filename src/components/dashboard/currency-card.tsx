import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoCard } from "@/components/dashboard/info-card";
import { CurrencyExchangeItem } from "@/components/dashboard/currency-exchange-item";
import { Info, ChevronDown } from "lucide-react";

interface CurrencyCardProps {
  exchangeRates: {
    flagIcon: React.ReactNode;
    currencyName: string;
    exchangeRate: string;
    currencyCode: string;
  }[];
}


export function CurrencyCard({ exchangeRates }: CurrencyCardProps) {
  return (
    <InfoCard title="Currency" className="p-6 space-y-8 bg-white rounded-2xl dark:bg-[#2C3542]">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-semibold text-[#1A1C1E] dark:text-white">
            Currency
          </h3>
          <Info className="w-4.5 h-4.5 text-secondary-400" />
        </div>
        <Select defaultValue="usd">
          <SelectTrigger className="flex items-center justify-center gap-2 px-6 h-12 border border-[#EDF1F3] dark:border-[#333a45] rounded-full bg-[#EDF1F3] dark:bg-[#222A35]">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="gbp">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-start w-full gap-6">
        {exchangeRates.map((currency, index) => (
          <CurrencyExchangeItem
            key={index}
            flagIcon={currency.flagIcon}
            currencyName={currency.currencyName}
            exchangeRate={currency.exchangeRate}
            currencyCode={currency.currencyCode}
          />
        ))}
      </div>
    </InfoCard>
  );
}
