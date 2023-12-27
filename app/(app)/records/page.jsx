"use client";

import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/ui/drawer-dialog";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthWeb5 } from "@/lib/auth";
import { useLoading } from "@/lib/store";
import protocolDefinition from "../../../public/assets/data/protocol.json";
import toast from "react-hot-toast";
import moment from "moment";
import { first } from "lodash";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function Page() {
  const { did, web5 } = useAuthWeb5();
  const [type, setType] = useState("expense");
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trxRecords, setTrxRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const setLoading = useLoading((state) => state.setMsg);

  useEffect(() => {
    if (!did || !web5) return;
    getAccount();
    getCategories();
    getRecords();
  }, [did, web5]);

  const getRecords = async () => {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.record.schema,
        },
        dateSort: "createdAscending",
      },
    });

    const rcrds = [];
    for (let record of records) {
      const data = await record.data.json();
      rcrds.push({ id: record.id, ...data });
    }
    setTrxRecords(rcrds);
  };

  const getAccount = async () => {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.account.schema,
        },
        dateSort: "createdAscending",
      },
    });

    const accnts = [];
    for (let record of records) {
      const data = await record.data.json();
      accnts.push({ id: record.id, ...data });
    }
    setAccounts(accnts);
  };

  const getCategories = async () => {
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          schema: protocolDefinition.types.category.schema,
        },
        dateSort: "createdAscending",
      },
    });

    const ctgrs = [];
    for (let record of records) {
      const data = await record.data.json();
      ctgrs.push({ id: record.id, ...data });
    }
    setCategories(ctgrs);
  };

  const handleSubmit = async (values) => {
    setLoading("Loading...");

    try {
      // Update account balance
      const { record: account } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: values.account,
          },
        },
      });
  
      const accountJson = await account.data.json();
      await account.update({
        data: {
          "@type": "account",
          name: accountJson.name,
          balance: type === "income" ? parseInt(accountJson.balance) + parseInt(values.amount) : parseInt(accountJson.balance) - parseInt(values.amount),
          author: did,
        },
      });

      // Add record transaction
      const { record } = await web5.dwn.records.create({
        data: {
          "@type": "record",
          author: did,
          account_id: values.account,
          category_id: values.category,
          date: values.date,
          amount: type === "income" ? values.amount : 0 - values.amount,
          note: type === "transfer" ? "Transfer" : values.note,
          type: type,
        },
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: "record",
          schema: protocolDefinition.types.record.schema,
          dataFormat: protocolDefinition.types.record.dataFormats[0],
        },
      });
      getRecords();
      toast.success("Success!");
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create a new record");
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
            <h1 className="text-white text-xl font-bold">Records</h1>
          </div>
        </div>
      </div>

      <div className="container px-4">
        <div className="w-full bg-white">
          <DataTable columns={columns} data={trxRecords} />
        </div>
      </div>

      <DrawerDialog open={open} setOpen={setOpen}>
        <Formik
          enableReinitialize
          initialValues={{ account: first(accounts)?.id, amount: "", category: "", note: "", date: moment().format("yyyy-MM-DD") }}
          validationSchema={Yup.object({
            account: Yup.string().required("Required"),
            amount: Yup.number().required("Required"),
            category: Yup.string().required("Required"),
            date: Yup.string().required("Required"),
          })}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-3 text-dark border border-dark text-sm text-center font-medium rounded-md">
                <button type="button" onClick={() => setType("expense")} className={`${type === "expense" && "bg-primary"} rounded-l-md p-2`}>
                  Expense
                </button>
                <button type="button" onClick={() => setType("income")} className={`${type === "income" && "bg-primary"} p-2`}>
                  Income
                </button>
                <button type="button" onClick={() => setType("transfer")} className={`${type === "transfer" && "bg-primary"} rounded-r-md p-2`}>
                  Transfer
                </button>
              </div>

              <div className="space-y-3 my-4">
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="date">Date</Label>
                  <div className="col-span-3">
                    <Field type="date" name="date" className="w-full rounded-md border-gray-300" placeholder="...." />
                    <ErrorMessage name="date" component="div" className="text-xs text-red-500 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="account">Account</Label>
                  <div className="col-span-3">
                    <Field as="select" name="account" className="w-full rounded-md border-gray-300">
                      {accounts.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="account" component="div" className="text-xs text-red-500 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="category">Category</Label>
                  <div className="col-span-3">
                    <Field as="select" name="category" className="w-full rounded-md border-gray-300">
                      {categories
                        ?.filter((o) => o.type === type)
                        .map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.name}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-xs text-red-500 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="col-span-3">
                    <Field type="text" name="amount" className="w-full rounded-md border-gray-300" placeholder="...." />
                    <ErrorMessage name="amount" component="div" className="text-xs text-red-500 font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor="note">Note</Label>
                  <div className="col-span-3">
                    <Field type="text" name="note" className="w-full rounded-md border-gray-300" placeholder="...." />
                    <ErrorMessage name="note" component="div" className="text-xs text-red-500 font-bold" />
                  </div>
                </div>
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
