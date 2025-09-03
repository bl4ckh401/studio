// components/layout/dashboard-header.tsx
"use client";

import { usePathname } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const BreadcrumbItem = ({ href, children, isLast }: { href?: string, children: React.ReactNode, isLast: boolean }) => (
  <div className="flex items-center gap-2">
    {href ? (
      <Link href={href}>
        <span className={`${isLast ? 'text-white font-semibold' : 'text-[#A2A6AA]'} font-manrope text-xs`}>
          {children}
        </span>
      </Link>
    ) : (
      <span className={`${isLast ? 'text-white font-semibold' : 'text-[#A2A6AA]'} font-manrope text-xs`}>
        {children}
      </span>
    )}
    {!isLast && <ChevronRightIcon className="h-2 w-2 text-[#A2A6AA]" />}
  </div>
);

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    // Remove 'dashboard' from segments if present, it's the root
    if(pathSegments[0] === 'dashboard') {
      pathSegments.shift();
    }

    const breadcrumbItems = pathSegments.map((segment, index) => {
      const href = `/dashboard/${pathSegments.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSegments.length - 1;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Special case for chama ID to show the name eventually
      if (pathSegments[index-1] === 'chamas' && !isNaN(Number(segment))) {
         return { href, label: `Group ${segment}`, isLast };
      }

      return { href, label, isLast };
    });
    
    return [{ href: '/dashboard', label: 'Dashboard', isLast: pathSegments.length === 0 }, ...breadcrumbItems];
  }, [pathname]);

  return (
    <div className="w-full bg-[#1C2634] dark:bg-[#2C3542] pb-6">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-20">
        <div className="flex flex-col gap-3 py-6">
          <h1 className="text-white text-2xl font-manrope font-semibold tracking-[-0.03em]">
            Welcome back,
            {mounted ? (
              <span> {user?.firstName ?? 'friend'} {user?.lastName ?? ''}</span>
            ) : (
              <span> friend</span>
            )}
            
          </h1>
          <div className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={index} href={crumb.href} isLast={crumb.isLast}>
                {crumb.label}
              </BreadcrumbItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
