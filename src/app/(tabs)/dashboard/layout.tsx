import type React from "react"
import type { Metadata } from "next"
import { DashboardNav } from "@/components/layout/dashboard-nav"
import { Suspense } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import RequireAuth from '@/components/auth/RequireAuth'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RequireAuth>
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
        </RequireAuth>
    )
}
