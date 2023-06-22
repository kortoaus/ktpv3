"use client";
import DataLoading from "@/components/ui/DataLoading";
import useTable from "@/libs/useTable";
import OpenSale from "@/screens/OpenSale";
import SignStaff from "@/screens/SignStaff";
import { Staff } from "@/types/model";
import React, { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function TablePage({ params: { id } }: Props) {
  const [staff, setStaff] = useState<null | Staff>(null);
  const { table, sale, isLoading: l1 } = useTable(id);
  const loading = l1;

  return (
    <>
      {loading ? (
        <DataLoading />
      ) : (
        <>
          {/* Not Loading */}
          {table ? (
            <>
              {staff ? (
                <>
                  {sale ? (
                    <>
                      <div>Sale Screen</div>
                    </>
                  ) : (
                    <>
                      <OpenSale staff={staff} table={table} />
                    </>
                  )}
                </>
              ) : (
                <SignStaff
                  signIn={(val) => {
                    console.log(val.name);
                    setStaff(val);
                  }}
                />
              )}
            </>
          ) : (
            <div>Table Not Found</div>
          )}
        </>
      )}
    </>
  );
}
