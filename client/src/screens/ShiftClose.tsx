"use client";
import CashCounter from "@/components/CashCounter";
import KickDrawerBtn from "@/components/KickDrawerBtn";
import SaleResult from "@/components/SaleResult";
import DataLoading from "@/components/ui/DataLoading";
import { StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ShiftResultType } from "@/types/Shift";
import { ApiResultType } from "@/types/api";
import { Shift } from "@/types/model";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type FormData = {
  closeCash: number;
  closeNote: string;
  differ: number;
};

type Props = {
  shift: Shift;
  shiftResult: ShiftResultType;
};

export default function ShiftClose({ shiftResult, shift }: Props) {
  const router = useRouter();
  const [cash, setCash] = useState(0);
  const [note, setNote] = useState("");

  const differ = new Decimal(shift.openCash)
    .plus(shiftResult.cashPaid)
    .minus(shiftResult.cashOut)
    .plus(shiftResult.cashIn)
    .minus(cash)
    .mul(-1)
    .toNumber();

  const [update, { result, loading }] =
    useMutation<ApiResultType>(`/api/shift/close`);

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    const data: FormData = {
      closeCash: cash,
      closeNote: note,
      differ,
      ...shiftResult,
    };

    update({ ...data });
  };

  useEffect(() => {
    if (result && result.ok) {
      setTimeout(() => router.push(`/`), 1500);
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, router]);

  return (
    <div className="w-full max-w-xl mx-auto py-8">
      <div className="mb-4">
        <h2 className="pb-2 border-b-2">Summary</h2>
        <SaleResult openCash={shift.openCash} data={shiftResult} />
      </div>

      {/* Cash Drawer */}
      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Cash Drawer</h2>
        <div>
          <CashCounter setVal={setCash} />
        </div>

        {/* Difference */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`f-btw text-white p-2 border-b ${
              differ < 0 ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div>Differ</div>
            <div>${differ.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Close Note</h2>
        <textarea
          className="p-2 border-gray-300 w-full rounded-md"
          placeholder="eg. Lorem Ipsum"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={150}
        />
      </div>

      {loading ? (
        <DataLoading />
      ) : (
        <button
          className="BasicBtn justify-center bg-green-500 text-white w-full !py-4 !border-0 text-xl"
          onClick={() => updateHandler()}
        >
          Close Shop
        </button>
      )}
      <KickDrawerBtn />
    </div>
  );
}
