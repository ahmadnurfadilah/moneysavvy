"use client";

import { LogIn } from "lucide-react";
import { Button } from "./button";
import { useLoading } from "@/lib/store";

export default function Auth() {
  const setLoading = useLoading((state) => state.setMsg);
  const handleConnect = () => {
    setLoading("Connecting your DID...");
  };

  return (
    <Button variant="primary" className="gap-2" onClick={handleConnect}>
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
}
