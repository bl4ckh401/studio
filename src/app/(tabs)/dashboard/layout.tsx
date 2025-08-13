import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { ChevronRightIcon } from "lucide-react"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
            <header className="sticky top-0 z-30">
                <DashboardNav />
            </header>
            <div className="w-full bg-[#1C2634] dark:bg-[#2C3542] pb-32">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-20">
                    <div className="flex flex-col gap-3 py-6">
                        <h1 className="text-white text-2xl font-manrope font-semibold tracking-[-0.03em]">
                            Welcome back, Osborne Ozzy👏🏻
                        </h1>
                        <div className="flex items-center gap-2 text-[#A2A6AA] font-manrope text-xs">
                            <span>Dashboard</span>
                            <ChevronRightIcon className="h-2 w-2" />
                            <span className="text-white font-semibold">Overview</span>
                        </div>
                    </div>
                    <DashboardTabs />
                </div>
            </div>
                <main className="flex-1 md:mt-16">{children}</main>

            </body>
        </html>
    )
}

