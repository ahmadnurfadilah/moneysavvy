import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function shortDid(did) {
  return did?.substring(0,14) + "..." + did?.substring(did?.length - 4)
}