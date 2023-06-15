"use client";
import CashCounter from "@/components/CashCounter";
import DataLoading from "@/components/ui/DataLoading";
import { StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type FormData = {
  openCash: number;
  openNote: string;
};

export default function ShiftOpen() {
  const router = useRouter();
  const [cash, setCash] = useState(0);
  const [note, setNote] = useState("");

  const [update, { result, loading }] =
    useMutation<ApiResultType>(`/api/shift/open`);

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    const data: FormData = {
      openCash: cash,
      openNote: note,
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
      {cash}
      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Cash Drawer</h2>
        <CashCounter setVal={setCash} />
      </div>
      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Open Note</h2>
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
          Open Shop
        </button>
      )}
    </div>
  );
}
