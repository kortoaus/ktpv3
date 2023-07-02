"use client";
import { PopUpProps } from "@/types/api";
import { BuffetClass, Sale, Staff, Table } from "@/types/model";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import BuffetPPForm, { BuffetDataType } from "../BuffetPPForm";
import useMutation from "@/libs/useMutation";
import { StillUpdating } from "@/libs/Messages";
import { buffetSummary, time } from "@/libs/util";
import { useRouter } from "next/navigation";
import DataLoading from "../ui/DataLoading";
import NumPad from "../NumPad";

type Props = PopUpProps & {
  table: Table;
  sale: Sale;
  staff: Staff;
};

export default function SaleBuffetTimeUpdateDrawer({
  table,
  sale,
  open,
  onClose,
  staff,
}: Props) {
  const router = useRouter();
  const [prefix, setPrefix] = useState<"+" | "-">("+");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) {
      setAmount("");
      setPrefix("+");
    }
  }, [open]);

  const [update, { loading, result }] = useMutation<{
    ok: boolean;
    msg?: string;
  }>(`/api/table/${table.id}/btime`, "POST");

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    const val = Number(`${prefix}${amount}`);

    if (val === 0 || isNaN(val)) {
      window.alert("Invalid Amount!");
      return;
    }

    const log = `${time(new Date()).format("YYMMDD HH:mm")}%%%${staff.name}(${
      staff.id
    })%%%[Modified Time: ${val}]\n`;

    const data = {
      id: sale.id,
      staffId: staff.id,
      amount: val,
      log,
    };

    update(data);

    return;
  };

  useEffect(() => {
    if (result && result.ok) {
      router.replace("/");
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update Buffet Data!");
    }
  }, [result, router]);

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <div className="p-4 max-w-lg">
        <div className="mb-4 pb-4 border-b f-btw gap-4">
          <h2 className="">{`Change Buffet Timer / #${table.name}`}</h2>
          <button
            onClick={() => onClose()}
            className="BasicBtn !border-0 text-white bg-red-500"
          >
            Cancel
          </button>
        </div>
        <h2 className="mb-2">Enter Amount</h2>

        {/* Prefix */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => {
              setPrefix("+");
            }}
            className={`BasicBtn justify-center ${
              prefix === "+" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Plus
          </button>
          <button
            onClick={() => {
              setPrefix("-");
            }}
            className={`BasicBtn justify-center ${
              prefix === "-" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Minus
          </button>
        </div>

        {/* Amount */}
        <div>
          <div
            className="flex items-center justify-end px-4 border mb-4 py-2 "
            onClick={() => setAmount("")}
          >
            <span
              className={`mr-1 ${
                prefix === "+" ? "text-green-500" : "text-red-500"
              }`}
            >
              {prefix}
            </span>
            <span className="text-lg font-medium mr-1">{`${Number(
              amount
            )}`}</span>
            <span className="text-gray-500 text-sm">mins</span>
          </div>
          <NumPad val={amount} setVal={setAmount} useDot={false} />
        </div>

        {loading ? (
          <DataLoading />
        ) : (
          <button
            onClick={() => updateHandler()}
            className="BasicBtn text-white bg-green-500 !border-0 w-full mt-4 justify-center text-2xl font-medium !py-2"
          >
            UPDATE
          </button>
        )}
      </div>
    </Drawer>
  );
}
