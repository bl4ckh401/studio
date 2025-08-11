
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  remember: z.boolean().default(false).optional(),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // No-op for now
    console.log(values);
  }

  return (
    <div className="min-h-screen w-full bg-background">
       <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="flex flex-col lg:flex-row">
         <div className="hidden lg:flex lg:fixed lg:w-1/2 lg:h-full flex-col">
          <div className="flex-grow relative">
            <Image
              src="https://i.imgur.com/M89lWjJ.png"
              alt="Man working on a laptop"
              data-ai-hint="man laptop coffee"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </div>

        <div className="lg:hidden relative h-64 w-full">
           <Image
              src="https://i.imgur.com/M89lWjJ.png"
              alt="Man working on a laptop"
               data-ai-hint="man laptop coffee"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
        </div>

        <main className="flex flex-1 flex-col items-center justify-center p-4 lg:ml-[50%] lg:w-1/2 lg:min-h-screen">
          <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8 py-12 lg:py-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Logo />
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-foreground">Welcome back to Findash</h1>
              <p className="text-sm text-muted-foreground">Let's empower your financial task today with Findash.</p>
            </div>
            <div className="hidden lg:block text-center">
               <h1 className="text-4xl font-bold text-foreground tracking-[-0.03em]">Welcome back to Findash</h1>
               <p className="text-base text-muted-foreground mt-3.5">Let’s empower your financial task today with Findash.</p>
            </div>
          </div>

          <Card className="w-full rounded-2xl p-6 lg:p-8 bg-card text-card-foreground">
            <CardHeader className="p-0 pb-6 text-center">
              <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight">
                Login first to your account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground/80">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                            <Input
                              type="email"
                              placeholder="yourname@gmail.com"
                              className="h-14 lg:h-16 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-muted-foreground/80">
                          Password
                        </FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                            <Input
                              type="password"
                              placeholder="••••••••••"
                              className="h-14 lg:h-16 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5 rounded-[4px] border-primary data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-semibold text-card-foreground">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="#"
                      className="text-sm font-semibold text-primary transition-colors hover:text-primary/90"
                    >
                      Forgot Password
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full !mt-8 h-12 rounded-xl text-base font-semibold"
                  >
                    Login
                  </Button>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5 pt-4">
                    <p className="text-sm font-semibold text-secondary">
                      Don't have an account?
                    </p>
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-primary transition-colors hover:text-primary/90"
                    >
                      Register Here
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">© 2025 Chama Connect. All rights reserved.</p>
        </div>
        </main>
      </div>
    </div>
  );
}
