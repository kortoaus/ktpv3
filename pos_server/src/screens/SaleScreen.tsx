"use client";
import CatalogueComp from "@/components/Catalogue";
import HomeIcon from "@/components/icons/HomeIcon";
import TimerIcon from "@/components/icons/TimerIcon";
import SaleBuffetTimeUpdateDrawer from "@/components/parts/SaleBuffetTimeUpdateDrawer";
import SaleBuffetDrawer from "@/components/parts/SaleBuffetUpdateDrawer";
import useBuffetTimer from "@/libs/useBuffetTimer";
import { buffetTimerMsg } from "@/libs/util";
import { Catalogue } from "@/types/Product";
import { BuffetClass, Sale, Staff, Table } from "@/types/model";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  sale: Sale;
  table: Table;
  staff: Staff;
  catalogue: Catalogue[];
  buffets: BuffetClass[];
};

export default function SaleScreen({
  sale,
  table,
  catalogue,
  buffets,
  staff,
}: Props) {
  const [openBuffetDrawer, setOpenBuffetDrawer] = useState(false);
  const [openBuffetTime, setOpenBuffetTime] = useState(false);
  const buffet = buffets.find((bf) => bf.id === sale.buffetId);
  const buffetTimer = useBuffetTimer({ buffet, started: sale.buffetStarted });

  return (
    <div className="SaleScreen">
      {/* Header */}
      <div className="HeaderContainer">
        <Link href="/" prefetch={false} className="fccc">
          <button className="HomeBtn">
            <HomeIcon />
          </button>
        </Link>
        <h2>Table #{table.name}</h2>
        <div className="h-full border-r"></div>
        <button
          onClick={() => setOpenBuffetDrawer(true)}
          className={`BasicBtn ${
            buffet ? "!border-0 bg-purple-500 text-white" : ""
          }`}
        >
          <TimerIcon />
          <span>{buffet?.name || "A la carte"}</span>
        </button>

        {buffetTimer && (
          <>
            <div className="text-red-500 font-medium">
              {
                buffetTimerMsg(
                  buffetTimer.phase,
                  buffetTimer.orderRem,
                  buffetTimer.stayRem
                ).pos
              }
            </div>
            <button
              className="bg-purple-500 text-white text-2xl p-2 rounded-md"
              onClick={() => setOpenBuffetTime(true)}
            >
              <TimerIcon size={24} />
            </button>
          </>
        )}
        <div className="h-full border-r"></div>
      </div>

      {/* Catalogue */}
      <div className="ContentContainer">
        <div className="CatalogeContainer">
          <CatalogueComp data={catalogue} />
        </div>
        <div className="ReceiptContainer">asdf</div>
      </div>

      <SaleBuffetDrawer
        open={openBuffetDrawer}
        sale={sale}
        table={table}
        buffets={buffets}
        onClose={() => setOpenBuffetDrawer(false)}
        staff={staff}
      />

      {buffet && sale.buffetStarted && (
        <SaleBuffetTimeUpdateDrawer
          open={openBuffetTime}
          onClose={() => setOpenBuffetTime(false)}
          sale={sale}
          table={table}
          staff={staff}
        />
      )}
    </div>
  );
}
