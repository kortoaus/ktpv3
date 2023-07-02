"use client";
import useShift from "@/libs/useShift";
import { TableContainerWithTables } from "@/types/Table";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import DataLoading from "../ui/DataLoading";
import TableLinkBtn, { TableHandlerBtn } from "../TableBtn";

type Props = PopUpProps & {
  move: (val: number) => void;
};

type ResultProps = {
  ok: boolean;
  result: TableContainerWithTables[];
};

export default function TableMoveDrawer({ open, onClose, move }: Props) {
  const [selected, setSelected] = useState<
    TableContainerWithTables | undefined
  >();
  const { data, isLoading: l2 } = useSWR<ResultProps>(`/api/table`);
  const { sales, shiftLoading: l3 } = useShift();

  const nogood = !data || !data.ok || !sales;
  const loading = l2 || l3;

  useEffect(() => {
    if (!selected && data && data.result[0]) {
      setSelected(data.result[0]);
    }
  }, [selected, data]);

  const getTables = () => {
    if (!selected || nogood) {
      return [];
    }

    const placeholders = Array(100).fill(0);
    const tbs = placeholders.map((_, idx) => {
      return selected.tables.find((tb) => tb.index === idx + 1);
    });

    const tables = tbs.map((tb) => {
      const sale = sales.find((sale) => sale.tableId === tb?.id);
      return tb ? { ...tb, sale: sale ? sale : null } : undefined;
    });

    return tables;
  };

  const moveHandler = (id: number) => {
    move(id);
    onClose();
  };

  return (
    <Drawer anchor="top" open={open} onClose={() => onClose()}>
      {loading ? (
        <div className="h-full fccc">
          <DataLoading />
        </div>
      ) : (
        <div>
          <section className="h-16 bg-white fixed top-0 w-full border-b z-10">
            <div className="w-full h-full overflow-hidden flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                {data?.result.map((ct) => (
                  <button
                    className={`text-lg ${
                      selected && selected.id === ct.id
                        ? "font-medium text-blue-500"
                        : ""
                    }`}
                    key={ct.id}
                    onClick={() => setSelected(ct)}
                  >
                    {ct.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onClose()}
                className="BasicBtn bg-red-500 text-white !border-0"
              >
                Cancel
              </button>
            </div>
          </section>

          <section className="grid grid-cols-10 gap-4 p-4 pt-20">
            {getTables().map((table, idx) => {
              return (
                <TableHandlerBtn
                  key={idx}
                  table={table}
                  handler={() => {
                    if (table && !table.sale) {
                      moveHandler(table.id);
                    }
                  }}
                />
              );
            })}
          </section>
        </div>
      )}
    </Drawer>
  );
}
