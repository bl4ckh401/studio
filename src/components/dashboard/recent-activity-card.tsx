import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityItem } from "./activity-item";
import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { InfoCard } from "./info-card";

interface Activity {
  id: number;
  name: string;
  category: string;
  amount: string;
  date: string;
  time: string;
  icon: string; // Placeholder for icon
  type: "send" | "receive" | "transfer";
}

interface RecentActivityCardProps {
  activities: Activity[];
}

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <InfoCard className="p-6 space-y-4 bg-white rounded-2xl dark:bg-gray-800 w-full lg:w-[351px]">
      <CardHeader className="flex w-full flex-row items-center justify-between p-0">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-lg font-semibold leading-relaxed text-[#1A1C1E] dark:text-gray-200">
            Recent Activity
          </CardTitle>{/* info-circle */}
 <InfoIcon className="h-[18px] w-[18px] text-[#6C7278] dark:text-gray-400" />
 </div>
        <CardDescription className="flex items-center gap-1.5 text-sm font-medium leading-relaxed tracking-[-0.02em] text-[#ACB5BB] dark:text-gray-400">
          See more
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col p-0 gap-8">
        {activities.map((activity, id) => (
          <ActivityItem key={id} activity={activity} />
        ))}
      </CardContent>
    </InfoCard>
  );
}