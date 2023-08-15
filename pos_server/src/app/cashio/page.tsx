"use client";
import DataLoading from "@/components/ui/DataLoading";
import useDevice from "@/libs/useDevice";
import CashIOScreen from "@/screens/CashIOScreen";
import SignStaff from "@/screens/SignStaff";
import { Staff } from "@/types/model";
import React, { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function TablePage({ params: { id } }: Props) {
  // useAutoReload();
  const { device } = useDevice();
  const [staff, setStaff] = useState<null | Staff>(null);

  const loading = device === undefined;

  return (
    <>
      {loading ? (
        <DataLoading />
      ) : (
        <>
          {staff ? (
            <>
              <CashIOScreen staff={staff} />
            </>
          ) : (
            <SignStaff signIn={setStaff} />
          )}
        </>
      )}
    </>
  );
}
