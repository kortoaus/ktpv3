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
  const { id, name, price, imgId, options: pOptions, outOfStock } = pd;

  const addLine = (qty: number, options: SelectedOptionType[]) => {
    let charged = new Decimal(0);

    options.forEach((opt) => {
      const optionValue = new Decimal(opt.qty).mul(opt.value);
      charged = charged.plus(optionValue);
    });

    const unitPrice = new Decimal(price).plus(charged);

    const data: SaleLineType = {
      productId: pd.id,
      id: new Date().getTime(),
      description: name,
      price: unitPrice.toNumber(),
      qty,
      discount: 0,
      total: unitPrice.mul(qty).toNumber(),
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
        className={`relative bg-white text-left w-full ${
          outOfStock ? "opacity-50" : ""
        }`}
        onClick={() => {
          if (outOfStock) {
            return;
          }
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

        {outOfStock && (
          <div className="w-full h-full absolute top-0 fccc z-10 ">
            <span className="bg-white/50 p-1">Sold Out</span>
          </div>
        )}
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
export function ItemHandlerBtn({
  pd,
  handler,
}: Props & {
  handler: (val: number) => void;
}) {
  const { id, name, price, imgId, outOfStock } = pd;

  return (
    <>
      <button
        key={`pd_${id}`}
        className={`bg-white text-left w-full ${
          outOfStock ? "opacity-50" : ""
        }`}
        onClick={() => {
          handler(id);
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
    </>
  );
}
