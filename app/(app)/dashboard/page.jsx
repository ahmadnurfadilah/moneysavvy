"use client";

import { useAuthWeb5 } from "@/lib/auth";
import { useAccountsStore, useCategoriesStore } from "@/lib/store";
import protocolDefinition from "../../../public/assets/data/protocol.json";
import { useEffect } from "react";

export default function Page() {
  const { did, web5 } = useAuthWeb5();
  const setAccounts = useAccountsStore((state) => state.setAccounts);
  const setCategories = useCategoriesStore((state) => state.setCategories);

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
    <div className="w-full bg-dark h-14 flex items-start">
      <div className="container px-4">
        <h1 className="text-white text-xl font-bold">Dashboard</h1>
      </div>
    </div>
  );
}
