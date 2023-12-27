"use client";

import { find } from "lodash";
import moment from "moment";

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return moment(row.getValue("date")).format("MMM DD, YYYY");
    },
  },
  {
    accessorKey: "account_id",
    header: "Account",
    cell: ({ row }) => {
      const accounts = JSON.parse(sessionStorage.getItem("accounts-storage"))?.state?.accounts;
      return find(accounts, (o) => o.id === row.getValue("account_id"))?.name;
    },
  },
  {
    accessorKey: "category_id",
    header: "Category",
    cell: ({ row }) => {
      const categories = JSON.parse(sessionStorage.getItem("categories-storage"))?.state?.categories;
      return find(categories, (o) => o.id === row.getValue("category_id"))?.name;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return (
        <div className={`text-right font-medium ${row.original.type === "income" ? "text-green-600" : "text-red-600"}`}>
          {row.original.type === "income" && "+"}
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      return row.getValue("note") || "-";
    },
  },
];
