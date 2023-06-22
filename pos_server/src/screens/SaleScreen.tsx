import { Catalogue } from "@/types/Product";
import { SaleWithTotal } from "@/types/Sale";
import { BuffetClass, Sale, Table } from "@/types/model";
import React from "react";

type Props = {
  sale: Sale;
  table: Table;
  catalgoue: Catalogue[];
  buffets: BuffetClass[];
};

export default function SaleScreen({
  sale: { buffetId },
  table,
  catalgoue,
  buffets,
}: Props) {
  const buffet = buffets.find((bf) => bf.id === buffetId);

  return (
    <div>
      <div className="border-b h-16 bg-white flex items-center px-4 gap-4">
        <div>Table #{table.name}</div>
        <div>{buffet?.name}</div>
      </div>

      <div className="mt-4 p-4">
        {catalgoue.map(({ id, name, products }) => {
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
    </div>
  );
}
