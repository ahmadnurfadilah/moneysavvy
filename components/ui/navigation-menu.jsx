"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationMenu() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-8 text-sm font-bold">
      <Link className={`transition-all ${pathname.startsWith("/dashboard") ? "text-primary" : "text-white/60 hover:text-white"}`} href="/dashboard">
        Dashboard
      </Link>
      <Link className={`transition-all ${pathname.startsWith("/accounts") ? "text-primary" : "text-white/60 hover:text-white"}`} href="/accounts">
        Accounts
      </Link>
      <Link className={`transition-all ${pathname.startsWith("/records") ? "text-primary" : "text-white/60 hover:text-white"}`} href="/records">
        Records
      </Link>
      <Link className={`transition-all ${pathname.startsWith("/analytics") ? "text-primary" : "text-white/60 hover:text-white"}`} href="/analytics">
        Analytics
      </Link>
    </div>
  );
}
