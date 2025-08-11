"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    console.log(values);
    // Simulate API call
    setTimeout(() => {
      // Simulate success
      setStatus("success");
      // Simulate error
      // setStatus("error");
    }, 2000);
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
              src="https://i.imgur.com/hEquQac.png"
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
                <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a reset link.
                </p>
              </div>
            </div>

            <Card className="w-full rounded-2xl p-6 lg:p-8 bg-card text-card-foreground flex flex-col items-center justify-center min-h-[300px]">
              <CardHeader className="p-0 pb-6 text-center">
                {status === "idle" && (
                  <>
                    <CardTitle className="text-2xl lg:text-3xl font-bold tracking-tight">
                      Reset your password
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Enter your email to receive a reset link
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent className="p-0 w-full flex flex-col items-center justify-center">
                {status === "idle" && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6 w-full"
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
                                  className="h-14 rounded-xl bg-card pl-12 text-sm text-card-foreground placeholder:text-card-foreground/60 border-border"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full !mt-8 h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    </form>
                  </Form>
                )}

                {status === "success" && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
                    <p className="text-lg font-semibold text-card-foreground">
                      Password reset successful! Check your email.
                    </p>
                    <Link href="/login" className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">Back to Login</Link>
                  </div>
                )}

                 {status === "error" && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <XCircle className="h-20 w-20 text-red-500 animate-pulse" />
                    <p className="text-lg font-semibold text-card-foreground">
                     Failed to send reset email. Please try again later.
                    </p>
                     <Button onClick={() => setStatus("idle")} variant="outline" className="text-sm font-semibold">Try Again</Button>
                  </div>
                )}
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
