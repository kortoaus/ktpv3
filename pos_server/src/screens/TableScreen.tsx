"use client";
import Sidebar from "@/components/Sidebar";
import TableLinkBtn from "@/components/TableBtn";
import MenuIcon from "@/components/icons/MenuIcon";
import { getData, mutation } from "@/libs/apiURL";
import useAutoReload from "@/libs/useAutoReload";
import { socket } from "@/libs/webSocket";
import { SaleWithTotal } from "@/types/Sale";
import { TableContainerWithTables } from "@/types/Table";
import { ApiResultType } from "@/types/api";
import { Device } from "@/types/model";
import React, { useEffect, useState } from "react";

type Props = {
  device: Device;
  sales: SaleWithTotal[];
  containers: TableContainerWithTables[];
};

export default function TableScreen({ device, containers, sales }: Props) {
  useAutoReload();
  const [selected, setSelected] = useState(containers[0]);
  const [isMenu, setIsMenu] = useState(false);

  const reload = () => {
    if (!window) {
      return;
    }
    window.location.reload();
  };

  const getTables = () => {
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

  const currentSales = () => {
    let pp = sales.reduce((a, b) => a + b.pp, 0);
    return `${sales.length} Tables / ${pp} customers`;
  };

  const lastInvHandler = async () => {
    const result: ApiResultType = await mutation("/api/shift/lastreceipt", "");
    if (!result || !result.ok) {
      window.alert(result?.msg || "Receipt Not Found");
    }
    return;
  };

  return (
    <div>
      {/* Header */}
      <section className="h-16 bg-white fixed top-0 w-full border-b z-10">
        <div className="w-full h-full overflow-hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 onClick={() => reload()}>{device.name}</h1>
            {containers.map((ct) => (
              <button
                className={`text-lg ${
                  selected.id === ct.id ? "font-medium text-blue-500" : ""
                }`}
                key={ct.id}
                onClick={() => setSelected(ct)}
              >
                {ct.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div>{currentSales()}</div>
            <button onClick={() => lastInvHandler()}>Last Inv.</button>
            <button
              onClick={() => setIsMenu(true)}
              className="BasicBtn fccc h-full text-blue-500 !border-0"
            >
              <MenuIcon size={36} />
            </button>
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="grid grid-cols-10 gap-4 p-4 pt-20">
        {getTables().map((table, idx) => {
          return <TableLinkBtn key={idx} table={table} />;
        })}
      </section>
      <Sidebar open={isMenu} onClose={() => setIsMenu(false)} />
    </div>
  );
}
