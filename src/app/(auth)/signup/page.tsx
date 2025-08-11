
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, User, Phone, User2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    // Submit logic here
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
              src="https://i.imgur.com/sBEt6Z5.jpeg"
              alt="Man working on a laptop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative flex items-center justify-center w-full z-10 text-black text-center h-[23vh] bg-primary">
            <h1 className="text-primary-foreground text-xl lg:w-3/4 font-bold leading-relaxed tracking-[-0.02em]">
              Secure, Transparent, and
              <br />
              Automated Savings for Your
              <br />
              Chama & SACCO
            </h1>
          </div>
        </div>

        <div className="lg:hidden relative h-64 w-full">
           <Image
              src="https://i.imgur.com/sBEt6Z5.jpeg"
              alt="Man working on a laptop"
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
                <h1 className="text-2xl font-bold text-foreground">Join Chama Connect</h1>
                <p className="text-sm text-muted-foreground">
                  Create your account to get started.
                </p>
              </div>
            </div>

            <Card className="w-full rounded-2xl p-6 lg:p-8 bg-card text-card-foreground">
              <CardHeader className="p-0 pb-6 text-center">
                <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Create your account
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground/80">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                                <Input
                                  placeholder="John"
                                  className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
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
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground/80">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                                <Input
                                  placeholder="Doe"
                                  className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                                className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-muted-foreground/80">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                              <Input
                                type="tel"
                                placeholder="+254 712 345 678"
                                className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                  className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
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
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground/80">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-card-foreground/60" />
                                <Input
                                  type="password"
                                  placeholder="••••••••••"
                                  className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full !mt-8 h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90"
                    >
                      Create Account
                    </Button>
                    <div className="flex justify-center items-center gap-1.5 pt-4">
                      <p className="text-sm font-semibold text-secondary">
                        Already have an account?
                      </p>
                      <Link
                        href="/login"
                        className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        Login
                      </Link>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              © 2025 Chama Connect. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

    