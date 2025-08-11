import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PocketPlanItemProps {
  icon: React.ReactNode; // Placeholder for icon/image
  name: string;
  amount: string;
}

const PocketPlanItem: React.FC<PocketPlanItemProps> = ({
  icon,
  name,
  amount,
}) => {
  return (
    <div className="flex items-center gap-5 w-full p-5 border border-secondary-200 rounded-xl">
      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-grow">
        <div className="text-sm font-semibold leading-tight text-secondary-500 dark:text-secondary-500">
          {name}
        </div>
        <div className="text-xs font-semibold leading-tight text-secondary-300 dark:text-secondary-300">
          {amount}
        </div>
      </div>
    </div>
  );
};

interface PocketPlanCardProps {
  plans: {
    icon: React.ReactNode; // Placeholder for icon/image
    title: string;
    amount: string;
  }[];
}

const PocketPlanCard: React.FC<PocketPlanCardProps> = ({ plans }) => {
  return (
    <Card className="flex flex-col p-6 gap-6 bg-primary-0 dark:bg-secondary-900 rounded-2xl w-[365px] h-[407px]">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-lg font-semibold leading-[27px] tracking-[-0.02em] text-secondary-500 dark:text-primary-0 flex items-center gap-1.5">
          My Pocket Plans
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4.5 h-4.5 text-secondary-400 dark:text-secondary-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Information about pocket plans</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <div className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-sm font-medium leading-normal tracking-[-0.02em] text-secondary-300 dark:text-secondary-300">
            See more
          </span>
          {/* Placeholder for arrow icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-secondary-300 dark:text-secondary-300"
          >
            <path
              d="M5.25 10.5L8.75 7L5.25 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-4 w-full h-full">
        {plans.map((plan, index) => (
          <PocketPlanItem
            key={index}
            icon={plan.icon}
            name={plan.title}
            amount={plan.amount}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default PocketPlanCard;