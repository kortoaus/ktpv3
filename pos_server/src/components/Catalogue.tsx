"client";
import { Catalogue } from "@/types/Product";
import { SaleLineType } from "@/types/Sale";
import React, { useRef } from "react";
import ItemBtn from "./ItemBtn";

type Props = {
  cat: Catalogue[];
  add: (val: SaleLineType) => void;
};

export default function CatalogueComp({ cat, add }: Props) {
  const scrollHandler = (id: string) => {
    const target = window.document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="p-4 grid grid-cols-6 h-full gap-4">
      {/* Scroll Btn */}
      <div className="h-full overflow-scroll flex flex-col gap-2">
        {cat.map(({ id, name }) => {
          return (
            <button
              onClick={() => scrollHandler(`cat_${id}`)}
              className="BasicBtn justify-center text-sm"
              key={`catbtn_${id}`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Catalogue Page */}
      <div className="col-span-5 h-full overflow-scroll">
        {cat.map(({ id, name, products }) => {
          return (
            <div key={id} className="mb-4" id={`cat_${id}`}>
              <div className="h-12 fccc font-medium border">{name}</div>
              <div className="grid grid-cols-5 p-4 gap-4">
                {products.map((pd) => {
                  return (
                    <div key={pd.id} className="">
                      <ItemBtn pd={pd} add={add} key={`pd_${pd.id}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
