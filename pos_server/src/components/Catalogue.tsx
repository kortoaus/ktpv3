import { Catalogue } from "@/types/Product";
import Image from "next/image";
import React from "react";

type Props = {
  data: Catalogue[];
};

export default function CatalogueComp({ data }: Props) {
  return (
    <div className="p-4">
      {data.map(({ id, name, products }) => {
        return (
          <div key={id} className="mb-4">
            <div className="h-12 fccc font-medium border">{name}</div>
            <div className="grid grid-cols-5 p-4 gap-4">
              {products.map((pd) => {
                return (
                  <button key={`pd_${pd.id}`} className="bg-white text-left">
                    {pd.imgId ? (
                      <div className="SquareImg">
                        <Image
                          alt={name}
                          src={`http://localhost:3000/imgs/${pd.imgId}`}
                          width={512}
                          height={512}
                        />
                      </div>
                    ) : (
                      <div className="SquareImg bg-gray-100"></div>
                    )}
                    <div className="px-2">
                      <div className="text-sm font-medium">{pd.name}</div>
                      <div>{`$${pd.price.toFixed(2)}`}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
