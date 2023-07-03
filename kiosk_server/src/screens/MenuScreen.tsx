"use client";
import { MenuComp } from "@/components/Catalogue";
import Sidebar from "@/components/Sidebar";
import DataLoading from "@/components/ui/DataLoading";
import { Catalogue } from "@/types/Product";
import { ApiResultType } from "@/types/api";
import { BuffetClass, Product } from "@/types/model";
import React, { useState } from "react";
import useSWR from "swr";

type SWRProps = ApiResultType & {
  result: Catalogue[];
};

type Props = { buffets: BuffetClass[]; name: string; holiday: boolean };

export default function MenuScreen({ name, buffets, holiday }: Props) {
  const [selected, setSelected] = useState<number>(buffets[0].id || 0);
  const { data, isLoading } = useSWR<SWRProps>("/api/product");
  const [isMenu, setIsMenu] = useState(false);

  const loading = isLoading || !data || (data && !data.ok);

  if (loading) {
    return (
      <div className="w-full h-screen">
        <DataLoading />
      </div>
    );
  }

  const filteredCats = (): Catalogue[] => {
    if (!data || !data.ok) {
      return [];
    }

    const cats = data.result.map((dt) => ({ ...dt }));

    let filtered = cats.map((ct) => {
      const products = ct.products
        .filter((pd) => {
          const buffetIds: number[] = JSON.parse(pd.buffetIds);
          const buffetOK =
            buffetIds.find((id) => id === selected) !== undefined;
          const showOK = !pd.hideKiosk;
          return buffetOK && showOK;
        })
        .map((pd) => {
          return { ...pd, price: JSON.parse(pd.buffetPrice)[selected] || 0 };
        });
      return {
        ...ct,
        products,
      };
    });

    filtered = filtered.filter((ct) => ct.products.length !== 0 && !ct.hoc);

    return filtered;
  };

  const buffetCat = (): Catalogue[] => {
    const buffet = buffets.find((bf) => bf.id === selected);
    if (!buffet) {
      return [];
    }
    const {
      id,
      name,
      priceA,
      priceB,
      priceC,
      h_priceA,
      h_priceB,
      h_priceC,
      nameA,
      nameB,
      nameC,
    } = buffet;

    const A: Product = {
      id: new Date().getTime() + 1,
      name: nameA,
      price: holiday ? h_priceA : priceA,
      options: "[]",
      categoryId: 1,
      printerIds: "[]",
      buffetIds: `[${id}]`,
      buffetPrice: JSON.stringify({ [id]: holiday ? h_priceA : priceA }),
      createdAt: new Date(),
      updatedAt: new Date(),
      imgId: null,
      mId: null,
      cost: 0,
      isBuffet: true,
      index: 1,
      hideKiosk: false,
      outOfStock: false,
      archived: false,
    };

    const B: Product = {
      id: new Date().getTime() + 2,
      name: nameB,
      price: holiday ? h_priceB : priceB,
      options: "[]",
      categoryId: 1,
      printerIds: "[]",
      buffetIds: `[${id}]`,
      buffetPrice: JSON.stringify({ [id]: holiday ? h_priceB : priceB }),
      createdAt: new Date(),
      updatedAt: new Date(),
      imgId: null,
      mId: null,
      cost: 0,
      isBuffet: true,
      index: 1,
      hideKiosk: false,
      outOfStock: false,
      archived: false,
    };

    const C: Product = {
      id: new Date().getTime() + 3,
      name: nameC,
      price: holiday ? h_priceC : priceC,
      options: "[]",
      categoryId: 1,
      printerIds: "[]",
      buffetIds: `[${id}]`,
      buffetPrice: JSON.stringify({ [id]: holiday ? h_priceC : priceC }),
      createdAt: new Date(),
      updatedAt: new Date(),
      imgId: null,
      mId: null,
      cost: 0,
      isBuffet: true,
      index: 1,
      hideKiosk: false,
      outOfStock: false,
      archived: false,
    };

    const cat: Catalogue = {
      id: 0,
      name: `Pricing`,
      index: 0,
      archived: false,
      products: [A, B, C],
      hoc: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(cat);

    return [cat];
  };

  return (
    <div>
      {/* Header */}
      <section className="h-16 bg-white fixed top-0 w-full border-b z-10">
        <div className="w-full h-full overflow-hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
            >{`Table #${name}`}</h1>
          </div>
          <div className="flex items-center gap-4">
            {buffets
              .filter((bf) => bf.priceA !== 0)
              .map((bf) => (
                <button
                  className={`BasicBtn ${
                    bf.id === selected ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setSelected(bf.id)}
                  key={bf.id}
                >
                  {bf.name}
                </button>
              ))}
          </div>
        </div>
      </section>

      <div className="h-screen pt-16 overflow-hidden relative">
        <div className="h-full">
          <MenuComp
            cat={[...buffetCat(), ...filteredCats()]}
            add={(add) => null}
            handler={(val) => null}
          />
        </div>
      </div>

      <Sidebar open={isMenu} onClose={() => setIsMenu(false)} />
    </div>
  );
}
