"use client";
import CatalogueComp, { MenuComp } from "@/components/Catalogue";
import Sidebar from "@/components/Sidebar";
import MenuIcon from "@/components/icons/MenuIcon";
import DataLoading from "@/components/ui/DataLoading";
import { mutation } from "@/libs/apiURL";
import { Catalogue, CategoryWithProductCount } from "@/types/Product";
import { ApiResultType } from "@/types/api";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  catalogue: Catalogue[];
  refresh: () => void;
};

export default function MenuScreen({ catalogue, refresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const toggleHandler = async (id: number) => {
    if (loading) {
      return;
    }

    setLoading(true);
    const result: ApiResultType = await mutation(`/api/product/${id}/oos`, {});

    if (result.ok) {
      // mutation
      refresh();
    } else {
      window.alert(result.msg || "Failed Update!");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <section className="h-16 bg-white fixed top-0 w-full border-b z-10">
        <div className="w-full h-full overflow-hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="BasicBtn !border-0 text-white bg-blue-500">
                Home
              </button>
            </Link>
            <h1>Menu</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenu(true)}
              className="BasicBtn fccc h-full text-blue-500 !border-0"
            >
              <MenuIcon size={36} />
            </button>
          </div>
        </div>
      </section>

      <div className="h-screen pt-16 overflow-hidden relative">
        <div className="h-full">
          <MenuComp
            cat={catalogue}
            add={(add) => null}
            handler={(val) => toggleHandler(val)}
          />
          {loading && (
            <div className="absolute top-0 h-screen w-full bg-gray-500/25">
              <DataLoading />
            </div>
          )}
        </div>
      </div>

      <Sidebar open={isMenu} onClose={() => setIsMenu(false)} />
    </div>
  );
}
