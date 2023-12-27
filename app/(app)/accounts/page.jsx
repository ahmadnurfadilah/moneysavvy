"use client";

import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ArrowRightCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthWeb5 } from "@/lib/auth";
import { useAccountsStore, useLoading } from "@/lib/store";
import protocolDefinition from "../../../public/assets/data/protocol.json";
import toast from "react-hot-toast";

export default function Page() {
  const { did, web5 } = useAuthWeb5();
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const setLoading = useLoading((state) => state.setMsg);
  const setAccountsStore = useAccountsStore((state) => state.setAccounts);

  useEffect(() => {
    if (!did || !web5) return;
    getRecord();
  }, [did, web5]);

  const getRecord = async () => {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.account.schema,
        },
        dateSort: "createdAscending",
      },
    });

    const newAccounts = [];
    for (let record of records) {
      const data = await record.data.json();
      newAccounts.push({ id: record.id, ...data });
    }
    setAccounts(newAccounts);
    setAccountsStore(newAccounts);
  };

  const handleSubmit = async (values) => {
    setLoading("Loading...");

    const newAccount = {
      "@type": "account",
      name: values.name,
      balance: parseInt(values.balance),
      author: did,
    };

    try {
      const { record } = await web5.dwn.records.create({
        data: newAccount,
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: "account",
          schema: protocolDefinition.types.account.schema,
          dataFormat: protocolDefinition.types.account.dataFormats[0],
        },
      });
      getRecord();
      toast.success("Success!");
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create a new account");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-dark h-16 flex items-start mb-5">
        <div className="container px-4">
          <div className="flex items-center gap-4">
            <Button size="sm" variant="primary" onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" />
              New
            </Button>
            <h1 className="text-white text-xl font-bold">Accounts</h1>
          </div>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accounts.map((i) => (
            <Link
              key={i.id}
              href="/"
              className="w-full bg-white rounded-2xl border shadow-sm flex items-center group hover:shadow-md transition-all hover:border-dark"
            >
              <div className="flex-1 p-4">
                <h2 className="mb-1 text-gray-500">{i.name}</h2>
                <p className="font-mono font-bold text-xl">${i.balance}</p>
              </div>
              <div className="shrink-0 bg-primary h-full rounded-r-2xl w-1/5 p-2 flex justify-center items-center text-dark/50 group-hover:w-1/4 transition-all group-hover:text-dark duration-500">
                <ArrowRightCircle className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <DrawerDialog open={open} setOpen={setOpen} title="New" desc="Create a new account">
        <Formik
          initialValues={{ name: "", balance: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            balance: Yup.number().required("Required"),
          })}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Account Name</Label>
                <Field type="text" name="name" className="w-full rounded-md border-gray-300" placeholder="...." />
                <ErrorMessage name="name" component="div" className="text-xs text-red-500 font-bold" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="balance">Current Balance</Label>
                <Field type="text" name="balance" className="w-full rounded-md border-gray-300" placeholder="...." />
                <ErrorMessage name="balance" component="div" className="text-xs text-red-500 font-bold" />
              </div>
              <Button type="submit" variant="dark" className="w-full" size="lg" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </DrawerDialog>
    </>
  );
}
