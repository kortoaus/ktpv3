"use client";
import { SaleLineType, SelectedOptionType } from "@/types/Sale";
import { Product } from "@/types/model";
import Decimal from "decimal.js";
import Image from "next/image";
import React, { useState } from "react";
import ModalPortal from "./ModalPortal";
import OptionModal from "./OptionModal";
import { ProductOptionGroup } from "@/types/Product";

type Props = {
  pd: Product;
  add: (val: SaleLineType) => void;
};

export default function ItemBtn({ pd, add }: Props) {
  const [openOption, setOpenOption] = useState(false);
  const { id, name, price, imgId, options: pOptions } = pd;

  const addLine = (qty: number, options: SelectedOptionType[]) => {
    const data: SaleLineType = {
      productId: pd.id,
      id: new Date().getTime(),
      description: name,
      price: price,
      qty,
      discount: 0,
      total: new Decimal(price).mul(qty).toNumber(),
      cancelled: false,
      options,
      note: "",
      printerIds: JSON.parse(pd.printerIds),
    };

    add(data);
  };

  return (
    <>
      <button
        key={`pd_${id}`}
        className="bg-white text-left w-full"
        onClick={() => {
          setOpenOption(true);
          // if (hasOption) {
          // } else {
          //   addLine(1, []);
          // }
        }}
      >
        {imgId ? (
          <div className="SquareImg z-0">
            <Image
              alt={name}
              src={`http://localhost:3000/imgs/${imgId}`}
              width={512}
              height={512}
            />
          </div>
        ) : (
          <div className="SquareImg bg-gray-100"></div>
        )}
        <div className="px-2 text-center">
          <div className="text-sm font-medium">{name}</div>
          <div>{`$${price.toFixed(2)}`}</div>
        </div>
      </button>
      {openOption && (
        <ModalPortal>
          <OptionModal
            onClose={() => setOpenOption(false)}
            pd={pd}
            add={(qty, option) => addLine(qty, option)}
          />
        </ModalPortal>
      )}
    </>
  );
}
