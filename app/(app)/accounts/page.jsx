"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Plus } from "lucide-react";
import Link from "next/link";

const dummy = [
  { id: 1, name: "Cash", amount: 120, category: "Cash" },
  { id: 2, name: "BCA", amount: 100, category: "Debit" },
  { id: 3, name: "Mandiri", amount: 220, category: "Debit" },
];

export default function Page() {
  return (
    <>
      <div className="w-full bg-dark h-16 flex items-start mb-5">
        <div className="container px-4">
          <div className="flex items-center gap-4">
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4" />
              New
            </Button>
            <h1 className="text-white text-xl font-bold">Accounts</h1>
          </div>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dummy.map((i) => (
            <Link key={i.id} href="/" className="w-full bg-white rounded-2xl border shadow-sm flex items-center group hover:shadow-md transition-all hover:border-dark">
              <div className="flex-1 p-4">
                <h2 className="mb-1 text-gray-500">{i.name}</h2>
                <p className="font-mono font-bold text-xl">${i.amount}</p>
              </div>
              <div className="shrink-0 bg-primary h-full rounded-r-2xl w-1/5 p-2 flex justify-center items-center text-dark/50 group-hover:w-1/4 transition-all group-hover:text-dark duration-500">
                <ArrowRightCircle className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
