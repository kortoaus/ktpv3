"use client";
import CashCounter from "@/components/CashCounter";
import KickDrawerBtn from "@/components/KickDrawerBtn";
import DataLoading from "@/components/ui/DataLoading";
import { HandlerCheckbox } from "@/components/ui/form/ToggleCheckbox";
import { StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { Product } from "@/types/model";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type FormData = {
  openCash: number;
  openNote: string;
  holiday: boolean;
  revive: number[];
};

export default function ShiftOpen({ oos }: { oos: Product[] }) {
  const router = useRouter();
  const [cash, setCash] = useState(0);
  const [note, setNote] = useState("");
  const [holiday, setHoliday] = useState(false);
  const [revive, setRevive] = useState<number[]>([]);

  const [update, { result, loading }] =
    useMutation<ApiResultType>(`/api/shift/open`);

  const toggleRevive = (id: number) => {
    const exist = Boolean(revive.find((re) => re === id));

    if (exist) {
      setRevive(revive.filter((re) => re !== id));
    } else {
      setRevive([...revive, id]);
    }
    return;
  };

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    const data: FormData = {
      openCash: cash,
      openNote: note,
      holiday,
      revive,
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
      {/* Cash */}
      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Cash Drawer</h2>
        <CashCounter setVal={setCash} />
      </div>

      {/* Properties */}
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

        <h2 className="mb-2">Use Holiday Price</h2>
        <HandlerCheckbox
          id="is_holiday"
          checked={holiday}
          onChange={() => setHoliday((prev) => !prev)}
          label="Public Holiday"
        />
      </div>

      {/* OOS */}
      <div className="mb-4">
        <h2 className="mb-2 pb-2 border-b-2">Out of Stock</h2>
        {oos.map((oo) => {
          return (
            <div key={`oos_${oo.id}`} className="p-1 border-b">
              <HandlerCheckbox
                id={`oos_${oo.id}`}
                checked={Boolean(revive.find((re) => re === oo.id))}
                onChange={() => toggleRevive(oo.id)}
                label={oo.name}
              />
            </div>
          );
        })}
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

      <KickDrawerBtn />
    </div>
  );
}
