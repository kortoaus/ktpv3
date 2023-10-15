"use client";
import { Product } from "@/types/model";
import Image from "next/image";
import React, { useState } from "react";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import { ProductOptionGroup } from "@/types/Product";
import { OptionGroupCard } from "./OptionGroupCard";
import { SaleLineType, SelectedOptionType } from "@/types/Sale";

type Props = {
  onClose: () => void;
  pd: Product;
  add: (qty: number, options: SelectedOptionType[]) => void;
};

export default function OptionModal({
  onClose,
  pd: { name, imgId, options: rawOptions },
  add,
}: Props) {
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<SelectedOptionType[]>([]);

  const groups: ProductOptionGroup[] = JSON.parse(rawOptions);
  const hasOption = groups.length !== 0;

  const validator = (group: ProductOptionGroup) => {
    const { min, max, mode } = group;
    const count = options
      .filter((opt) => opt.gId === group.id)
      .reduce((a, b) => a + b.qty, 0);

    const minOK = count >= min;
    let maxOK = count <= max;

    if (mode === "count" && max === 0) {
      maxOK = true;
    }

    return maxOK && minOK;
  };

  const goodToGo = () => {
    const oks = groups.map((group) => validator(group));
    if (oks.findIndex((ok) => ok === false) !== -1) {
      return false;
    }
    return true;
  };

  const addHandler = () => {
    add(qty, options);
    onClose();
  };

  return (
    <div className="OptionModal">
      <div
        className={`OptionModalContainer ${
          hasOption ? "max-w-4xl" : "max-w-[300px]"
        }`}
      >
        <div className="HeaderContainer">
          <h2>{name}</h2>
          <button
            className="BasicBtn !border-0 bg-red-500 text-white"
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>

        <div className={`BodyContainer ${hasOption ? "hasOption" : ""}`}>
          {hasOption && (
            <div className="OptionGroupContainer grid grid-cols-2 gap-4 border-r pr-2 mx-2">
              {groups.map((group) => {
                return (
                  <OptionGroupCard
                    ok={validator(group)}
                    group={group}
                    key={group.id}
                    options={options}
                    addOption={(val: SelectedOptionType[]) => setOptions(val)}
                  />
                );
              })}
            </div>
          )}

          <div className={`${hasOption ? "" : "mx-auto"}`}>
            {/* Image */}
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

            {/* Qty */}
            <div className="QtyContainer">
              <button
                onClick={() => {
                  if (qty > 1) {
                    setQty((prev) => prev - 1);
                  }
                }}
              >
                <MinusIcon size={36} />
              </button>
              <div className="text-2xl font-medium">{qty}</div>
              <button
                onClick={() => {
                  setQty((prev) => prev + 1);
                }}
              >
                <PlusIcon size={36} />
              </button>
            </div>

            {/* Btns */}
            {goodToGo() && (
              <>
                <button
                  onClick={() => addHandler()}
                  className="BasicBtn w-full mt-4 justify-center !py-2 !border-0 bg-red-500 text-white text-2xl"
                >
                  Add
                </button>
                <div className="mt-2 text-sm font-medium text-center text-red-500">
                  {`Any leftovers will be charged $15 per table.`}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
