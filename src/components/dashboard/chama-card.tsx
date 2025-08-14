// components/dashboard/chama-card.tsx
"use client";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Eye, 
  MoreVertical, 
  Trash2, 
  UserPlus, 
  Users, 
  DollarSign, 
  Landmark 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/dashboard/bar-chart";
import Link from 'next/link';

interface ChamaCardProps {
  group: {
    id: number;
    name: string;
    status: "Active" | "Inactive";
    members: number;
    contributions: number;
    expenses: number;
  };
}

export function ChamaCard({ group }: ChamaCardProps) {
  const chartData = [
    { name: 'Contributions', value: group.contributions },
    { name: 'Expenses', value: group.expenses }
  ];

  return (
    <Card className="flex flex-col bg-white dark:bg-[#2C3542] text-card-foreground shadow-md rounded-2xl h-full">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-base font-bold">{group.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#2C3542]">
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Leave Group
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Contributions</p>
              <p className="font-semibold">${group.contributions.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Expenses</p>
              <p className="font-semibold">${group.expenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Members</p>
              <p className="font-semibold">{group.members}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${group.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <p className="font-semibold">{group.status}</p>
            </div>
          </div>
        </div>
        
        {/* Mini chart for contributions vs expenses */}
        <div className="mt-4">
          <BarChart 
            data={chartData} 
            colors={['#3B82F6', '#EF4444']}
            height={80}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90">
          <Link href={`/dashboard/chamas/${group.id}`}>
            View Group Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}