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
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background">
      <div className="relative w-full h-64 lg:h-auto lg:w-1/2">
        <Image
          src="https://placehold.co/750x1052.png"
          alt="Man working on a laptop"
          data-ai-hint="man laptop coffee"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-8 lg:space-y-14">
          <div className="space-y-6 text-center">
            <Logo />
            <div className="space-y-3.5">
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-white">
                Welcome back to Chama Connect
              </h1>
              <p className="text-sm lg:text-base font-semibold text-muted-foreground">
                Let’s empower your financial task today with Chama Connect.
              </p>
            </div>
          </div>

          <Card className="w-full rounded-2xl p-6 lg:p-8">
            <CardHeader className="p-0 pb-8 text-center lg:text-left">
              <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight text-card-foreground">
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
                        <FormLabel className="text-xs font-medium text-muted-foreground">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground" />
                            <Input
                              type="email"
                              placeholder="yourname@gmail.com"
                              className="h-14 lg:h-16 rounded-2xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/80"
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
                        <FormLabel className="text-xs font-medium text-muted-foreground">
                          Password
                        </FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground" />
                            <Input
                              type="password"
                              placeholder="••••••••••"
                              className="h-14 lg:h-16 rounded-2xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/80"
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
                          <FormLabel className="cursor-pointer text-sm lg:text-base font-semibold text-card-foreground">
                            Remember me
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link
                      href="#"
                      className="text-sm lg:text-base font-semibold text-primary transition-colors hover:text-primary/90"
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
                    <p className="text-sm lg:text-base font-semibold text-secondary">
                      Don't have an account?
                    </p>
                    <Link
                      href="#"
                      className="text-sm lg:text-base font-semibold text-primary transition-colors hover:text-primary/90"
                    >
                      Register Here
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <p className="text-xs lg:text-sm text-secondary">
            © 2024 Chama Connect. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
