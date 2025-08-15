
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, Calendar as CalendarIcon, UploadCloud, Trash2 } from "lucide-react";
import Image from 'next/image';

export default function SettingsPage() {
  return (
    <div className="flex justify-center w-full bg-[#F4F4F7] dark:bg-[#1A1C1E]">
      <main className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 -mt-20">
        <Card className="bg-white dark:bg-[#2C3542] rounded-2xl shadow-md p-6 sm:p-8">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-1.5">
                Personal Information
              </CardTitle>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          
          <Separator className="bg-border" />

          <CardContent className="p-0 mt-6">
            <div className="space-y-8">
              {/* Profile Photo Section */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-xs font-medium text-muted-foreground">Photo Profile</Label>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image src="https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan" alt="User Profile" layout="fill" objectFit="cover" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline">
                       <UploadCloud className="mr-2 h-4 w-4" />
                      Upload new photo
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-medium text-muted-foreground">First Name</Label>
                  <Input id="firstName" defaultValue="Osborne" className="h-14 rounded-xl"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-medium text-muted-foreground">Last Name</Label>
                  <Input id="lastName" defaultValue="Ozzy" className="h-14 rounded-xl"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
                <Input id="email" type="email" defaultValue="osborn@example.com" className="h-14 rounded-xl"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-xs font-medium text-muted-foreground">Date of Birth</Label>
                 <div className="relative">
                    <Input id="dob" type="text" placeholder="Select your date of birth" className="h-14 rounded-xl pr-12" />
                    <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-medium text-muted-foreground">Country</Label>
                   <Select defaultValue="usa">
                      <SelectTrigger className="h-14 rounded-xl">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">City</Label>
                   <Select defaultValue="new-york">
                      <SelectTrigger className="h-14 rounded-xl">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="london">London</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-xs font-medium text-muted-foreground">Zip Code</Label>
                  <Input id="zip" defaultValue="10001" className="h-14 rounded-xl"/>
                </div>
              </div>

              <Separator className="my-8 bg-border" />

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl">Cancel</Button>
                <Button className="w-full sm:w-auto h-12 rounded-xl bg-primary hover:bg-primary/90">Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
