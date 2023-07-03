"use client";

import ResetIcon from "@/components/icons/ResetIcon";
import DataLoading from "@/components/ui/DataLoading";
import useDevice from "@/libs/useDevice";
import useShift from "@/libs/useShift";
import useTable from "@/libs/useTable";
import { reloadPage } from "@/libs/util";
import { socket } from "@/libs/webSocket";
import MenuScreen from "@/screens/MenuScreen";
import SaleScreen from "@/screens/SaleScreen";
import { TableContainerWithTables } from "@/types/Table";
import { useEffect } from "react";

type ResultProps = {
  ok: boolean;
  result: TableContainerWithTables[];
};

export default function TitlePage() {
  const { device, isLoading: l1 } = useDevice();
  const { table, sale, catalogue, buffets, isLoading: l2, mutate } = useTable();
  const { shift } = useShift();

  const sk = socket;
  useEffect(() => {
    if (device) {
      sk.on(`table_${device.tableId || 0}`, () => {
        reloadPage();
      });
      sk.on(`table_${device.tableId || 0}_mutate`, () => {
        mutate();
      });
      sk.on("refresh", () => {
        reloadPage();
      });
      sk.on("mutate", () => {
        mutate();
      });
    }
  }, [device, sk, mutate]);

  const isLoading = l1 || l2;

  return (
    <>
      {isLoading && <DataLoading />}

      <div>
        {!isLoading && (
          <>
            {shift && table ? (
              <>
                {sale ? (
                  <SaleScreen
                    sale={sale}
                    table={table}
                    catalogue={catalogue ? catalogue : []}
                    buffets={buffets ? buffets : []}
                  />
                ) : (
                  <MenuScreen
                    holiday={shift.holiday}
                    buffets={
                      buffets ? buffets.filter((bf) => bf.priceA !== 0) : []
                    }
                    name={table.name}
                  />
                )}
              </>
            ) : (
              <div className="fixed top-0 w-full h-screen z-50 bg-black/25 fccc">
                <h1 className="text-white">Shop is closed.</h1>
                <button
                  onClick={() => {
                    if (window) {
                      window.location.reload();
                    }
                  }}
                  className="BasicBtn bg-blue-500 text-white !border-0 mt-4 text-xl"
                >
                  <ResetIcon />
                  <span>Refresh</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
