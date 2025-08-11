import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PocketPlanItemProps {
  icon: React.ReactNode;
  name: string;
  amount: string;
}

const PocketPlanItem: React.FC<PocketPlanItemProps> = ({
  icon,
  name,
  amount,
}) => {
  return (
    <div className="flex items-start gap-4 p-5 border border-[#DCE4E8] dark:border-[#333a45] rounded-xl bg-white dark:bg-transparent">
      <div className="w-10 h-10 bg-[#EDF1F3] dark:bg-[#2C3542] rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <div className="text-base font-semibold text-[#1A1C1E] dark:text-white">
          {name}
        </div>
        <div className="text-sm font-semibold text-secondary-300 dark:text-gray-400">
          {amount}
        </div>
      </div>
    </div>
  );
};

interface PocketPlanCardProps {
  plans: {
    icon: React.ReactNode;
    title: string;
    amount: string;
  }[];
}

const PocketPlanCard: React.FC<PocketPlanCardProps> = ({ plans }) => {
  return (
    <Card className="flex flex-col items-start p-6 space-y-6 bg-white rounded-2xl dark:bg-[#2C3542] w-full">
      <CardHeader className="flex flex-row items-center justify-between w-full p-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-1.5 text-[#1A1C1E] dark:text-white">
          My Pocket Plans
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4.5 h-4.5 text-secondary-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Information about pocket plans</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <div className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-secondary-300 dark:text-gray-400">
          <span>See more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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
