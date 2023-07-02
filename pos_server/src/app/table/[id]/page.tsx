"use client";
import DataLoading from "@/components/ui/DataLoading";
import useAutoReload from "@/libs/useAutoReload";
import useDevice from "@/libs/useDevice";
import useTable from "@/libs/useTable";
import { reloadPage } from "@/libs/util";
import { socket } from "@/libs/webSocket";
import OpenSale from "@/screens/OpenSale";
import SaleScreen from "@/screens/SaleScreen";
import SignStaff from "@/screens/SignStaff";
import { Staff } from "@/types/model";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function TablePage({ params: { id } }: Props) {
  // useAutoReload();
  const { device } = useDevice();
  const [staff, setStaff] = useState<null | Staff>(null);
  const {
    table,
    sale,
    catalogue,
    buffets,
    isLoading: l1,
    mutate,
  } = useTable(id);
  const loading = l1;

  const sk = socket;

  useEffect(() => {
    if (device && table) {
      // sk.on(`table_${table.id}`, () => {
      //   reloadPage();
      // });
      sk.on(`table_${table.id}_mutate`, () => {
        mutate();
      });
      sk.on("refresh", () => {
        reloadPage();
      });
      sk.on("mutate", () => {
        mutate();
      });
    }
  }, [device, table, mutate]);

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
                      <OpenSale
                        buffets={buffets ? buffets : []}
                        staff={staff}
                        table={table}
                      />
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
