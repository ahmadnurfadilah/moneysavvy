"use client";

import { useAuthWeb5 } from "@/lib/auth";
import { useAccountsStore, useCategoriesStore } from "@/lib/store";
import protocolDefinition from "../../../public/assets/data/protocol.json";
import { useEffect } from "react";
import { ArrowDownUp, ArrowUpRightFromCircle, Gauge, WalletCards } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Sun",
    expense: 4000,
  },
  {
    name: "Mon",
    expense: 3000,
  },
  {
    name: "Tue",
    expense: 2000,
  },
  {
    name: "Wed",
    expense: 2780,
  },
  {
    name: "Thu",
    expense: 1890,
  },
  {
    name: "Fri",
    expense: 2390,
  },
  {
    name: "Sat",
    expense: 3490,
  },
];

export default function Page() {
  const { did, web5 } = useAuthWeb5();
  const setAccounts = useAccountsStore((state) => state.setAccounts);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  // Sync account & categories
  useEffect(() => {
    if (!did || !web5) return;
    const getAccount = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.account.schema,
          },
        },
      });

      const accounts = [];
      for (let record of records) {
        const data = await record.data.json();
        accounts.push({ id: record.id, ...data });
      }
      setAccounts(accounts);
    };

    const getCategories = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.category.schema,
          },
        },
      });

      const categories = [];
      for (let record of records) {
        const data = await record.data.json();
        categories.push({ id: record.id, ...data });
      }
      setCategories(categories);
    };

    getAccount();
    getCategories();
  }, [did, web5]);

  return (
    <>
      <div className="w-full bg-dark h-14 flex items-start mb-5">
        <div className="container px-4">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4 bg-white rounded-md border shadow p-4">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-gray-500" />
              Summary
            </h2>
            <div className="w-full space-y-4 divide-y">
              <div className="w-full flex gap-4 items-center">
                <div className="shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <WalletCards className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-lg">$12.000</h4>
                  <p className="text-sm text-gray-500">Balance</p>
                </div>
                <div className="shrink-0"></div>
              </div>
              <div className="w-full flex gap-4 items-center pt-2">
                <div className="shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                  <ArrowDownUp className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-lg">$12.000</h4>
                  <p className="text-sm text-gray-500">Cash Flow</p>
                </div>
                <div className="shrink-0"></div>
              </div>
              <div className="w-full flex gap-4 items-center pt-2">
                <div className="shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center">
                  <ArrowUpRightFromCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-lg">$12.000</h4>
                  <p className="text-sm text-gray-500">Expense</p>
                </div>
                <div className="shrink-0"></div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-white rounded-md border shadow p-4">
            <ResponsiveContainer width="100%" height="100%" className="font-mono">
              <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
