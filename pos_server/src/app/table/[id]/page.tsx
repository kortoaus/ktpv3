"use client";
import DataLoading from "@/components/ui/DataLoading";
import useAutoReload from "@/libs/useAutoReload";
import useTable from "@/libs/useTable";
import OpenSale from "@/screens/OpenSale";
import SaleScreen from "@/screens/SaleScreen";
import SignStaff from "@/screens/SignStaff";
import { Staff } from "@/types/model";
import React, { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function TablePage({ params: { id } }: Props) {
  useAutoReload();
  const [staff, setStaff] = useState<null | Staff>(null);
  const { table, sale, catalogue, buffets, isLoading: l1 } = useTable(id);
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
                    <SaleScreen
                      table={table}
                      sale={sale}
                      staff={staff}
                      catalogue={catalogue ? catalogue : []}
                      buffets={buffets ? buffets : []}
                    />
                  ) : (
                    <>
                      <OpenSale staff={staff} table={table} />
                    </>
                  )}
                </>
              ) : (
                <SignStaff signIn={setStaff} />
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
