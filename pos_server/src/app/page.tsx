"use client";

import ResetIcon from "@/components/icons/ResetIcon";
import DataLoading from "@/components/ui/DataLoading";
import useDevice from "@/libs/useDevice";
import useShift from "@/libs/useShift";
import TableScreen from "@/screens/TableScreen";
import { TableContainerWithTables } from "@/types/Table";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  result: TableContainerWithTables[];
};

export default function TitlePage() {
  const { device, isLoading: l1 } = useDevice();
  const { data, isLoading: l2 } = useSWR<ResultProps>(`/api/table`);
  const { shift, sales, shiftLoading: l3 } = useShift();

  const isLoading = l1 || l2 || l3;

  const ok =
    device !== undefined &&
    data !== undefined &&
    data.ok &&
    sales !== undefined &&
    device.type === "POS";
  return (
    <>
      {isLoading && <DataLoading />}

      <div>
        {!isLoading && ok && (
          <TableScreen
            sales={sales.filter((sale) => sale.closedAt === null)}
            device={device}
            containers={data.result}
            kitchen={!shift?.kitchenClosed || false}
          />
        )}
        {!isLoading && !shift && (
          <div className="fixed top-0 w-full h-screen z-50 bg-black/25 fccc">
            <h1 className="text-white">Please Open Shift.</h1>
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
      </div>
    </>
  );
}
