import { useCategoriesStore } from "@/lib/store";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

export default function ExpenseCategory({ records }) {
  const [data, setData] = useState([]);
  const categories = useCategoriesStore((state) => state.categories);

  useEffect(() => {
    if (categories) {
      let amountCategories = categories.map((i) => {
        return { name: i.name, value: 0, id: i.id };
      });

      if (records.length > 0) {
        for (const r of records) {
          const findCat = amountCategories.find((o) => o.id === r.category_id);
          const withOutCat = amountCategories.filter((o) => o.id !== r.category_id);
          amountCategories = [...withOutCat, { name: findCat.name, value: findCat.value + Math.abs(r.amount), id: findCat.id }];
        }
      }

      setData(amountCategories.filter((o) => o.value > 0));
    }
  }, [records]);

  return (
    <ResponsiveContainer width="100%" height="100%" className="font-mono">
      <PieChart width={400} height={400}>
        <Pie dataKey="value" isAnimationActive={false} data={data} cx="50%" cy="50%" outerRadius={80} fill="#f43f5e" label />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
