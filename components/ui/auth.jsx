"use client";

import { LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "./button";
import { useLoading, useUserStore } from "@/lib/store";
import { Web5 } from "@web5/api";
import Link from "next/link";

export default function Auth() {
  const setLoading = useLoading((state) => state.setMsg);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleConnect = async () => {
    setLoading("Connecting your DID...");
    const { did } = await Web5.connect();
    setUser({
      did: did,
      loggedIn: true,
    });
  };

  return user ? (
    <Link href="/dashboard">
      <Button variant="primary" className="gap-2">
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>
    </Link>
  ) : (
    <Button variant="primary" className="gap-2" onClick={handleConnect}>
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
}
