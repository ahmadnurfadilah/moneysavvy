"use client";

import { useAuthWeb5 } from "@/lib/auth";
import { useAccountsStore, useCategoriesStore } from "@/lib/store";
import protocolDefinition from "../../../public/assets/data/protocol.json";
import { useEffect, useState } from "react";
import { ArrowDownUp, ArrowUpRightFromCircle, Gauge, WalletCards } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sumBy } from "lodash";
import numeral from "numeral";
import moment from "moment";
import Link from "next/link";
import ExpenseCategory from "@/components/chart/expense-category";

export default function Page() {
  const { did, web5 } = useAuthWeb5();
  const [records, setRecords] = useState([]);
  const [graphWeekExpense, setGraphWeekExpense] = useState([]);
  const accounts = useAccountsStore((state) => state.accounts);
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
      if (accounts.length > 0) {
        setAccounts(accounts);
      }
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
      if (categories.length > 0) {
        setCategories(categories);
      }
    };

    getAccount();
    getCategories();
    getRecords();
  }, [did, web5]);

  useEffect(() => {
    const gwExpense = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      gwExpense.push({
        name: moment(date).format("ddd"),
        total: sumBy(
          records.filter((o) => o.type === "expense" && o.date === date),
          (o) => Math.abs(o.amount)
        ),
      });
    }

    setGraphWeekExpense(gwExpense);
  }, [records]);

  const getRecords = async () => {
    const { records: trxRecords } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.record.schema,
        },
      },
    });

    const rcrds = [];
    for (let r of trxRecords) {
      const data = await r.data.json();
      rcrds.push(data);
    }
    setRecords(rcrds);
  };

  return (
    <>
      <div className="w-full bg-dark h-14 flex items-start mb-5">
        <div className="container px-4">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>
        </div>
      </div>

      <div className="container px-4 pb-8">
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
                  <h4 className="font-mono font-bold text-lg uppercase">{numeral(sumBy(accounts, (o) => o.balance)).format("$0,")}</h4>
                  <p className="text-sm text-gray-500">Balance</p>
                </div>
                <div className="shrink-0"></div>
              </div>
              <div className="w-full flex gap-4 items-center pt-2">
                <div className="shrink-0 w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center">
                  <ArrowDownUp className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-lg uppercase">{numeral(sumBy(records, (o) => o.amount)).format("$0,")}</h4>
                  <p className="text-sm text-gray-500">Cash Flow</p>
                </div>
                <div className="shrink-0"></div>
              </div>
              <div className="w-full flex gap-4 items-center pt-2">
                <div className="shrink-0 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center">
                  <ArrowUpRightFromCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-lg uppercase">
                    {numeral(
                      sumBy(
                        records.filter((o) => o.type === "expense"),
                        (o) => Math.abs(o.amount)
                      )
                    ).format("$0,")}
                  </h4>
                  <p className="text-sm text-gray-500">Expense</p>
                </div>
                <div className="shrink-0"></div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-white rounded-md border shadow p-4">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-gray-500" />
              Expenses for the last 7 days
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" className="font-mono">
                <AreaChart
                  width={500}
                  height={400}
                  data={graphWeekExpense}
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
                  <YAxis
                    tickFormatter={(tick) => {
                      return numeral(tick).format("$0");
                    }}
                  />
                  <Tooltip formatter={(value) => numeral(value).format("$0")} />
                  <Legend />
                  <Area type="monotone" dataKey="total" stroke="#f43f5e" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-white rounded-md border shadow p-4 flex flex-col">
            <h2 className="shrink-0 font-bold flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-gray-500" />
              Expenses by Category
            </h2>
            <div className="flex-1 w-full aspect-square overflow-y-auto">
              <ExpenseCategory records={records.filter((o) => o.type === "expense")} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-white rounded-md border shadow p-4 flex flex-col">
            <h2 className="shrink-0 font-bold flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-gray-500" />
              Account Balance
            </h2>
            <div className="flex-1 w-full aspect-square overflow-y-auto space-y-2">
              {accounts.map((i) => (
                <Link href={`/accounts/${i.id}`} key={i.id} className="flex items-center justify-between border rounded-lg p-2 bg-gray-50 hover:bg-primary-50">
                  <h6 className="font-bold">{i.name}</h6>
                  <p className="font-mono">{numeral(i.balance).format("$0")}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-white rounded-md border shadow p-4 flex flex-col">
            <h2 className="shrink-0 font-bold flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-gray-500" />
              Last Records
            </h2>
            <div className="flex-1 w-full aspect-square overflow-y-auto divide-y">
              {records.map((i) => (
                <Link href={`/accounts/${i.id}`} key={i.id} className="flex items-center justify-between mb-2 pt-2">
                  <h6 className="font-bold">{accounts.find((o) => o.id === i.account_id).name}</h6>
                  <p className={`font-mono ${i.type === "expense" ? "text-red-600" : "text-green-600"}`}>{numeral(i.amount).format("$0")}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
