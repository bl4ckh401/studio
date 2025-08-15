import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"

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
            <Suspense>
              <DashboardHeader />
            </Suspense>
            <main className="flex-1 md:-mt-16">
              <Suspense>
                {children}
              </Suspense>
            </main>

            </body>
        </html>
    )
}
