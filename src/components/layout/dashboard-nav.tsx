import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchIcon, BellIcon, MessageSquare, User, LogOut, Settings } from "lucide-react";
import Image from 'next/image';
import { NotificationPopup } from '@/components/dashboard/notification-popup';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export function DashboardNav() {
  return (
    <nav className="w-full h-[89px] bg-[#1C2536] dark:bg-[#1A1C1E] flex items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="flex items-center gap-4 md:gap-8 lg:gap-16">
        <Logo />
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center px-4 py-2 bg-[rgba(255,255,255,0.07)] rounded-full gap-2 h-12 w-auto max-w-xs">
          <SearchIcon className="h-6 w-6 text-[#A2A6AA]" />
          <Input placeholder="Search anything here" className="bg-transparent border-none text-white placeholder:text-[rgba(255,255,255,0.5)] focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-auto py-0" />
        </div>
        <NotificationPopup />
        <Button variant="ghost" className="p-2 bg-[rgba(255,255,255,0.07)] rounded-full h-12 w-12 flex items-center justify-center">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan" alt="@shadcn" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Osborne Ozzy</p>
                <p className="text-xs leading-none text-muted-foreground">
                  osborn@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </nav>
  );
}
