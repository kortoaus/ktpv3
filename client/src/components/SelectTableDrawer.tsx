"use client";
import { TableContainerWithTables } from "@/types/Table";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import TablePlaceHolderCard, {
  TableBtn,
  TableExistCard,
} from "./TablePlaceHolderCard";

type Props = PopUpProps & {
  val?: number;
  setVal: (val: number) => void;
  tables: TableContainerWithTables[];
};

export default function SelectTableDrawer({
  val,
  setVal,
  onClose,
  open,
  tables,
}: Props) {
  const placeholder = Array(100).fill(0);
  const [selected, setSelected] = useState<
    TableContainerWithTables | undefined
  >(tables[0]);

  useEffect(() => {
    if (val && tables.length !== 0) {
      const exId = tables.findIndex((ct) => {
        return ct.tables.find((tb) => tb.id === val);
      });
      if (exId !== -1) {
        setSelected(tables[exId]);
      }
    }
  }, [val, tables]);

  return (
    <Drawer anchor="top" open={open} onClose={() => onClose()}>
      <div className="TableManagerContainer h-full relative w-full overflow-y-scroll">
        {/* Header */}
        <div className="h-14 bg-white z-20 border-b w-full sticky top-0">
          <div className="w-full h-full flex items-center p-2 px-8 gap-4">
            <button
              onClick={() => onClose()}
              className="BasicBtn bg-blue-500 text-white border-blue-500"
            >
              <span className="text-sm">Go Back</span>
            </button>
            <h1>{selected?.name || "Select Container"}</h1>

            <div>
              {tables
                .filter((ct) => ct.id !== selected?.id)
                .map((ct) => (
                  <button key={ct.id} onClick={() => setSelected(ct)}>
                    {ct.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Tables */}
        {selected && (
          <div className="p-8 pb-16">
            <div className="w-full grid grid-cols-10 gap-2">
              {placeholder.map((_, idx) => {
                const table = selected.tables.find(
                  (tb) => tb.index === idx + 1
                );
                return (
                  <button key={idx}>
                    {table ? (
                      <TableBtn
                        table={table.name}
                        selected={table.id === val}
                        handler={() => {
                          setVal(table.id);
                          onClose();
                        }}
                      />
                    ) : (
                      <TablePlaceHolderCard />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
