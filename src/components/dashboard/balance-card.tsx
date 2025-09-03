import { InfoCard } from "@/components/dashboard/info-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Info, Send, Share } from "lucide-react";

export function BalanceCard({ totalBalance, cardNumber }: { totalBalance?: string; cardNumber?: string }) {
  return (
    <InfoCard className="p-6 space-y-4 bg-white rounded-2xl dark:bg-[#2C3542] w-full shadow-md">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1.5">
          <h3 className="text-lg font-semibold text-secondary-500 dark:text-gray-200">
            Total Contributions
          </h3>
          <Info className="w-[18px] h-[18px] text-secondary-400 dark:text-gray-400" />
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-[27px] h-[16.69px] relative">
            <div className="absolute w-[9.04px] h-[9.04px] rounded-full bg-[#EB001B] left-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[9.04px] h-[9.04px] rounded-full bg-[#F79E1B] right-0 top-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[9.04px] h-[9.04px] rounded-full bg-opacity-75 bg-[#FF5F00] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <span className="text-sm font-medium text-secondary-300 dark:text-gray-400 font-manrope">
            {cardNumber}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-secondary-300 dark:text-gray-400" />
        </div>
      </div>
      <div className="flex items-start gap-[9px] w-full">
        <span className="text-4xl font-bold tracking-[-0.03em] text-secondary-500 dark:text-gray-100">
          {totalBalance}
        </span>
        <Eye className="w-4.5 h-4.5 text-secondary-400 dark:text-gray-400" />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-[15px]">
        <Button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-xl w-full sm:w-auto h-12 text-primary-foreground">
          <Send className="w-6 h-6" />
          <span className="text-base font-semibold">Apply for Loan</span>
        </Button>
        {/* <Button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary rounded-xl w-full sm:w-auto h-12 text-primary-foreground">
          <Share className="w-6 h-6" />
          <span className="text-base font-semibold">Receive</span>
        </Button> */}
      </div>
    </InfoCard>
  );
}
