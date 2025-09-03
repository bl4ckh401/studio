"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface Chama {
  id: string;
  name: string;
  status: string; // Example field
  memberCount: number; // Example field
  // Add other relevant fields for a chama
}

interface ChamaItemProps {
  chama: Chama;
}

function ChamaItem({ chama }: ChamaItemProps) {
  return (
    <Link href={`/dashboard/chamas/${chama.id}`}>
      <div className="flex items-center justify-between w-full p-4 border-b last:border-b-0 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center gap-3">
          {/* Placeholder for Chama Icon or Avatar */}
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
            {chama.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-manrope text-base font-semibold text-gray-800 dark:text-white tracking-[-0.02em]">{chama.name}</span>
            {/* Add other relevant chama info here, e.g., status */}
            <span className="font-manrope text-sm font-medium text-gray-500 dark:text-gray-400">{chama.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Example: Display member count */}
          <span className="font-manrope text-sm font-medium text-gray-500 dark:text-gray-400">{`${chama.memberCount} members`}</span>
          <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </Link>
  );
}

export default function ChamasListCard() {
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamas = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch('/api/v1/groups');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array of chama objects
        setChamas(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Failed to fetch chamas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChamas();
  }, []);

  return (
    <Card className="flex flex-col items-start p-6 space-y-6 bg-white rounded-2xl shadow-md dark:bg-gray-800 w-full">
      <CardHeader className="flex w-full flex-row items-center justify-between p-0">
        <CardTitle className="text-lg font-semibold leading-relaxed text-[#1A1C1E] dark:text-white flex items-center gap-1.5">
          My Chamas
          <Info className="h-4.5 w-4.5 text-[#6C7278] dark:text-[#A2A6AA]" />
        </CardTitle>
        <Link href="/dashboard/chamas" className="flex items-center gap-1.5 cursor-pointer text-sm font-medium leading-relaxed tracking-[-0.02em] text-secondary-300 dark:text-secondary-300">
          <span>See all</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-0 w-full">
        {loading && <p>Loading Chamas...</p>}
        {error && <p className="text-red-500">Error loading chamas: {error}</p>}
        {!loading && !error && chamas.length === 0 && <p>No chamas found.</p>}
        {!loading && !error && chamas.length > 0 && (
          <div>
            {chamas.map((chama) => (
              <ChamaItem key={chama.id} chama={chama} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}