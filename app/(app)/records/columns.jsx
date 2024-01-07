"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { find } from "lodash";
import { MoreHorizontal, Trash } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import protocolDefinition from "../../../public/assets/data/protocol.json";

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
        <div className={`text-right font-medium ${row.original.type === "income" || row.original.note === "Transfer In" ? "text-green-600" : "text-red-600"}`}>
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
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;

      const handleDelete = async () => {
        const { Web5 } = await import('@web5/api');
        
        const { web5, did } = await Web5.connect();

        // Get related record
        const { records: relRecords } = await web5.dwn.records.query({
          message: {
            filter: {
              schema: protocolDefinition.types.record.schema,
            },
            dateSort: "createdDescending",
          },
        });

        let relatedRecord;
        for (let r of relRecords) {
          const data = await r.data.json();
          if (
            data.type === "transfer" &&
            record.id !== r.id &&
            data.date === record.date &&
            (record.account_id === data.from_account_id || record.account_id === data.to_account_id)
          ) {
            relatedRecord = { id: r.id, ...data };
            continue;
          }
        }

        // Delete record
        const deleteResult = await web5.dwn.records.delete({
          message: {
            recordId: record.id,
          },
        });

        if (deleteResult?.status?.code >= 200 && deleteResult?.status?.code < 300) {
          // Read current account
          const { record: account } = await web5.dwn.records.read({
            message: {
              filter: {
                recordId: record.account_id,
              },
            },
          });

          const accountJson = await account.data.json();

          if (record.type === "transfer") {
            // Update current account balance
            await account.update({
              data: {
                "@type": "account",
                name: accountJson.name,
                balance: record.note === "Transfer In" ? parseInt(accountJson.balance) - Math.abs(record.amount) : parseInt(accountJson.balance) + Math.abs(record.amount),
                author: did,
              },
            });

            // Update related account balance
            const { record: relatedAccount } = await web5.dwn.records.read({
              message: {
                filter: {
                  recordId: relatedRecord.account_id,
                },
              },
            });

            const relatedAccountJson = await relatedAccount.data.json();

            await relatedAccount.update({
              data: {
                "@type": "account",
                name: relatedAccountJson.name,
                balance:
                  relatedRecord.note === "Transfer In"
                    ? parseInt(relatedAccountJson.balance) - Math.abs(record.amount)
                    : parseInt(relatedAccountJson.balance) + Math.abs(record.amount),
                author: did,
              },
            });

            // Delete related record
            await web5.dwn.records.delete({
              message: {
                recordId: relatedRecord.id,
              },
            });
          } else {
            // Update current account balance
            await account.update({
              data: {
                "@type": "account",
                name: accountJson.name,
                balance:
                  record.type === "income" ? parseInt(accountJson.balance) - Math.abs(record.amount) : parseInt(accountJson.balance) + Math.abs(record.amount),
                author: did,
              },
            });
          }

          toast.success("Success!");

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2" onClick={handleDelete}>
              <Trash className="w-3 h-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
