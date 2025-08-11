import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoCard } from "@/components/dashboard/info-card";
import { CurrencyExchangeItem } from "@/components/dashboard/currency-exchange-item";

interface CurrencyCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const dummyCurrencies = [
  { flag: "🇮🇩", name: "Rupiah", amount: "15425.15", code: "IDR" },
  { flag: "🇪🇺", name: "Euro", amount: "0.95", code: "EUR" },
  { flag: "🇨🇳", name: "Chinese Yuan", amount: "7.06", code: "CNY" },
];

export function CurrencyCard({ className, ...props }: CurrencyCardProps) {
  return (
    <InfoCard title="Currency" className="p-6 pb-[35px] gap-8" {...props}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-secondary-500">
            Currency
          </h3>
          {/* Assuming you have an info icon component or can use Lucide React */}
          {/* <InfoIcon className="w-4 h-4 text-secondary-400" /> */}
        </div>
        <Select defaultValue="usd">
          <SelectTrigger className="flex items-center justify-center gap-6 px-6 h-12 border border-secondary-100 rounded-[100px]">
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
        {dummyCurrencies.map((currency, index) => (
          <CurrencyExchangeItem key={index} {...currency} />
        ))}
      </div>
    </InfoCard>
  );
}