"use client";
import { BuffetDataType } from "@/components/BuffetPPForm";
import CatalogueComp from "@/components/Catalogue";
import HomeIcon from "@/components/icons/HomeIcon";
import TimerIcon from "@/components/icons/TimerIcon";
import SaleBuffetDrawer from "@/components/parts/SaleBuffetUpdateDrawer";
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
  const buffet = buffets.find((bf) => bf.id === sale.buffetId);

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
        <button
          onClick={() => setOpenBuffetDrawer(true)}
          className={`BasicBtn ${buffet ? "bg-purple-500 text-white" : ""}`}
        >
          <TimerIcon />
          <span>{buffet?.name || "A la carte"}</span>
        </button>
        <SaleBuffetDrawer
          open={openBuffetDrawer}
          sale={sale}
          table={table}
          buffets={buffets}
          onClose={() => setOpenBuffetDrawer(false)}
          staff={staff}
        />
      </div>

      {/* Catalogue */}
      <div className="ContentContainer">
        <div className="CatalogeContainer">
          <CatalogueComp data={catalogue} />
        </div>
        <div className="ReceiptContainer">asdf</div>
      </div>
    </div>
  );
}
