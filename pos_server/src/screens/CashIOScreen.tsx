"use client";
import NumPad from "@/components/NumPad";
import Sidebar from "@/components/Sidebar";
import MenuIcon from "@/components/icons/MenuIcon";
import DataLoading from "@/components/ui/DataLoading";
import { StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { Staff } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  staff: Staff;
};

export default function CashIOScreen({ staff }: Props) {
  const router = useRouter();
  const [isMenu, setIsMenu] = useState(false);
  const [mode, setMode] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [update, { loading, result }] = useMutation<{
    ok: boolean;
    msg?: string;
  }>(`/api/cashio`, "POST");

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    const val = Number(`${amount}`);

    if (val === 0 || isNaN(val)) {
      window.alert("Invalid Amount!");
      return;
    }

    const data = {
      staffId: staff.id,
      cashIn: mode === "in" ? val : 0,
      cashOut: mode === "in" ? 0 : val,
      note,
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
    <div>
      <section className="h-16 bg-white fixed top-0 w-full border-b z-10">
        <div className="w-full h-full overflow-hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="BasicBtn !border-0 text-white bg-blue-500">
                Home
              </button>
            </Link>
            <h1>Cash I/O</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenu(true)}
              className="BasicBtn fccc h-full text-blue-500 !border-0"
            >
              <MenuIcon size={36} />
            </button>
          </div>
        </div>
      </section>

      <div className="h-screen pt-16 overflow-hidden relative">
        <div className="w-full max-w-md mx-auto mt-16">
          {/* Header */}
          <div className="border-b pb-2 mb-2 flex items-center justify-between">
            <h1>{`Cash ${mode === "in" ? "In" : "Out"}`}</h1>
            <button
              className="bg-blue-500 text-white px-2 py-1"
              onClick={() => {
                setMode(mode === "in" ? "out" : "in");
              }}
            >
              {`Cash ${mode === "in" ? "Out" : "In"}`}
            </button>
          </div>

          {/* Amount */}
          <div>
            <div
              className="flex items-center justify-end px-4 border mb-4 py-2 "
              onClick={() => setAmount("")}
            >
              <span className="text-lg font-medium mr-1">{`${
                amount || 0
              }`}</span>
            </div>
            <NumPad val={amount} setVal={setAmount} useDot={true} />
          </div>

          {/* Note */}

          <h4 className="mt-4">Note</h4>
          <textarea
            className="w-full border-gray-300 rounded-md resize-none p-1"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={150}
          />

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
      </div>

      <Sidebar open={isMenu} onClose={() => setIsMenu(false)} />
    </div>
  );
}
