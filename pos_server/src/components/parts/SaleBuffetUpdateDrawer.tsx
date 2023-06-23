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

type Props = PopUpProps & {
  table: Table;
  sale: Sale;
  staff: Staff;
  buffets: BuffetClass[];
};

export default function SaleBuffetDrawer({
  table,
  sale,
  open,
  buffets,
  onClose,
  staff,
}: Props) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<BuffetDataType>({
    id: sale.buffetId ? sale.buffetId : undefined,
    ppA: sale.ppA,
    ppB: sale.ppB,
    ppC: sale.ppC,
  });
  const [buffetData, setBuffetData] = useState<BuffetDataType>({
    id: sale.buffetId ? sale.buffetId : undefined,
    ppA: sale.ppA,
    ppB: sale.ppB,
    ppC: sale.ppC,
  });
  const currentBuffet = buffets.find((bf) => bf.id === sale.buffetId);

  useEffect(() => {
    if (!open) {
      const snap = {
        id: sale.buffetId ? sale.buffetId : undefined,
        ppA: sale.ppA,
        ppB: sale.ppB,
        ppC: sale.ppC,
      };
      setBuffetData(snap);
      setSnapshot(snap);
    }
  }, [sale, open]);

  const [update, { loading, result }] = useMutation<{
    ok: boolean;
    msg?: string;
  }>(`/api/table/${table.id}/buffet`, "POST");

  const updateHandler = () => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    if (buffetData === snapshot) {
      router.replace("/");
      return;
    }

    const newBuffet = buffets.find((bf) => bf.id === buffetData.id);

    if (!newBuffet) {
      window.alert(`Please select a class!`);
      return;
    }

    const cSum = buffetSummary(snapshot, currentBuffet);
    const nSum = buffetSummary(buffetData, newBuffet);

    if (cSum.pp > nSum.pp) {
      const msg = `The number of customers has decreased. Are you sure you want to continue?`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    if (currentBuffet && currentBuffet.priceA > newBuffet.priceA) {
      const msg = `You are trying to downgrade class. Are you sure you want to continue?`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    if (newBuffet && nSum.pp < 1) {
      const msg = `the number of total customers can not be zero!`;
      window.alert(msg);
      return;
    }

    const log = `${time(new Date()).format("YYMMDD HH:mm")}%%%${staff.name}(${
      staff.id
    })%%%[${currentBuffet?.name || "A la carte"}/${cSum.pp}] => [${
      newBuffet.name
    } / ${nSum.pp}]\n`;

    const data = {
      id: sale.id,
      buffetId: newBuffet.id,
      ppA: buffetData.ppA,
      ppB: buffetData.ppB,
      ppC: buffetData.ppC,
      pp: nSum.pp,
      staffId: staff.id,
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

  const classFilter = () => {
    if (currentBuffet) {
      return buffets.filter((bfc) => bfc.priceA >= currentBuffet.priceA);
    } else {
      return buffets;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <div className="p-4 max-w-lg">
        <div className="mb-4 pb-4 border-b f-btw">
          <h2 className="">{`Change Buffet Class / #${table.name}`}</h2>
          <button
            onClick={() => onClose()}
            className="BasicBtn !border-0 text-white bg-red-500"
          >
            Cancel
          </button>
        </div>
        <h2 className="mb-2">Select Class</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {classFilter().map((bfc) => (
            <button
              className={`BasicBtn justify-center ${
                bfc.id === buffetData.id ? "text-white bg-blue-500" : ""
              }`}
              onClick={() => setBuffetData((prev) => ({ ...prev, id: bfc.id }))}
              key={bfc.id}
            >
              {bfc.name}
            </button>
          ))}
        </div>

        {buffetData.id && (
          <>
            <h2 className="mb-2">Customers</h2>
            <BuffetPPForm
              val={buffetData}
              buffet={buffets.find((bfc) => bfc.id === buffetData.id)}
              setVal={(val) => setBuffetData(val)}
            />
          </>
        )}

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
