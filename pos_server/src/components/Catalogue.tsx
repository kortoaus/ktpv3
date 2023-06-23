import { Catalogue } from "@/types/Product";
import React from "react";

type Props = {
  data: Catalogue[];
};

export default function CatalogueComp({ data }: Props) {
  return (
    <div>
      {data.map(({ id, name, products }) => {
        return (
          <div key={id} className="border mb-4">
            <div className="h-12 border-b fccc">{name}</div>
            <div className="grid grid-cols-5 p-4 gap-4">
              {products.map((pd) => {
                return (
                  <div key={`pd_${pd.id}`} className="border p-4">
                    <div>{pd.name}</div>
                    <div>{`$${pd.price.toFixed(2)}`}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
