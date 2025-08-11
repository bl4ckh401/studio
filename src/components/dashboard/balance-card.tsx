import { InfoCard } from "@/components/dashboard/info-card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Eye, Send, Share } from "lucide-react";

export function BalanceCard() {
  // Dummy data for now
  const totalBalance = "$12,456,315";
  const cardNumber = "**** 7189";

  return (
    <InfoCard className="p-6 space-y-4 bg-white rounded-2xl dark:bg-gray-800 w-full lg:w-[351px] lg:h-[209px]">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1.5">
          <h3 className="text-lg font-semibold leading-relaxed tracking-[-0.02em] text-secondary-500 dark:text-gray-200">
            Total Balance
          </h3>
          {/* Placeholder for info-circle icon */}
          <div className="w-[18px] h-[18px] text-secondary-400 dark:text-gray-400">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.5C13.125 16.5 16.5 13.125 16.5 9C16.5 4.875 13.125 1.5 9 1.5C4.875 1.5 1.5 4.875 1.5 9C1.5 13.125 4.875 16.5 9 16.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 6H9.0075"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
  />
              <path
                d="M8.25 9.75H9.75V12H8.25V9.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          {/* Placeholder for Mastercard icon - using a simple colored div for now */}
          <div className="w-[27px] h-[16.69px] opacity-73 relative">
            <div className="absolute left-[9.04%] right-[84.27%] top-[18.77%] bottom-[18.77%] bg-[#FF5F00]"></div>
            <div className="absolute left-[0%] right-[87.63%] top-[10.27%] bottom-[10.27%] bg-[#EB001B]"></div>
            <div className="absolute left-[12.4%] right-[75.23%] top-[10.27%] bottom-[10.27%] bg-[#F79E1B]"></div>
          </div>
          <span className="text-sm font-medium leading-relaxed tracking-[-0.02em] text-secondary-300 dark:text-gray-400 font-manrope">
            {cardNumber}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-secondary-300 dark:text-gray-400" />
        </div>
      </div>
      <div className="flex items-start gap-[9px] w-full">
        <span className="text-4xl font-bold leading-relaxed tracking-[-0.03em] text-secondary-500 dark:text-gray-100 gap-[9px]">
          {totalBalance}
        </span>
        <Eye className="w-4.5 h-4.5 text-secondary-400 dark:text-gray-400" />
      </div>
      <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-[15px]">
        <Button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-xl w-[144px] h-12 text-primary-0 dark:bg-primary-600">
          {/* Placeholder for card-send icon - using Lucide React Send for now */}
          <Send className="w-6 h-6" />
          <span className="text-base font-semibold leading-relaxed tracking-[-0.02em] text-center">
            Send
          </span>
        </Button>
        <Button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 rounded-xl w-[144px] h-12 text-primary-0 dark:bg-primary-600">
          {/* Placeholder for card-receive icon - using Lucide React Share for now */}
          <Share className="w-6 h-6" />
          <span className="text-base font-semibold leading-relaxed tracking-[-0.02em] text-center">
            Receive
          </span>
        </Button>
      </div>
    </InfoCard>
  );
}