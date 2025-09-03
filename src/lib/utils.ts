import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from "moment";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function formatDateWithTime(date: string) {
  return moment(date).format("DD MMM YYYY hh:mm A");
}

export function formatDate(date: string) {
  return moment(date).format("DD MMM YYYY");
}

export function formatRelativeTime(date: Date): string {
  return moment(date).fromNow();
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(amount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const getInitials = (name: string): string => {
  const parts = name.split(" ");
  return parts
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
};
