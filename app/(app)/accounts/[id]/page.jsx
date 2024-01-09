"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthWeb5 } from "@/lib/auth";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import numeral from "numeral";
import { useEffect, useState } from "react";
import { DataTable } from "../../records/data-table";
import { columns } from "../../records/columns";
import protocolDefinition from "../../../../public/assets/data/protocol.json";
import toast from "react-hot-toast";
import { useLoading } from "@/lib/store";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { did, web5 } = useAuthWeb5();
  const [account, setAccount] = useState(null);
  const [trxRecords, setTrxRecords] = useState([]);
  const setLoading = useLoading((state) => state.setMsg);

  useEffect(() => {
    if (!did || !web5) return;

    const getAccount = async () => {
      let { record } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: params.id,
          },
        },
      });
      setAccount(await record.data.json());
    };

    const getRecords = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.record.schema,
          },
          dateSort: "createdDescending",
        },
      });

      const rcrds = [];
      for (let record of records) {
        const data = await record.data.json();
        if (data.account_id === params.id) {
          rcrds.push({ id: record.id, ...data });
        }
      }
      setTrxRecords(rcrds);
    };

    getAccount();
    getRecords();
  }, [did, web5, params]);

  const handleDelete = async () => {
		setLoading("Deleting records...");

    for (const r of trxRecords) {
      await web5.dwn.records.delete({
        message: {
          recordId: r.id,
        },
      });
    }

		setLoading("Deleting account...");
		await web5.dwn.records.delete({
      message: {
        recordId: params.id,
      },
    });

		setLoading(false);
    router.push("/accounts");
    toast.success("Success delete");
  };

  return (
    <>
      <div className="w-full bg-dark h-16 flex items-start mb-5">
        <div className="container px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/accounts" className={`gap-2 ${buttonVariants({ variant: "primary", size: "sm" })}`}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            {account && (
              <h1 className="text-white text-xl font-bold">
                {account?.name} &mdash; {numeral(account?.balance).format("$0,")}
              </h1>
            )}
          </div>

          <Button size="icon" variant="destructive" onClick={() => handleDelete()}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container px-4">
        <div className="w-full bg-white">
          <DataTable columns={columns} data={trxRecords} />
        </div>
      </div>
    </>
  );
}
