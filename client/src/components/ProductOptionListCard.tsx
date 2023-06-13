import { ProductOptionGroup } from "@/types/Product";
import React from "react";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import RadioUncheckedIcon from "./icons/RadioUncheckedIcon";
import UncheckedIcon from "./icons/UncheckedIcon";

type Props = {
  data: ProductOptionGroup;
};

export const ProductOptionListCard = ({
  data: { name, required, max, min, mode, options },
}: Props) => {
  return (
    <div className="w-full border p-2 rounded-md">
      {/* Group */}
      <div className="f-btw">
        <div>
          <h4 className="font-medium">{name}</h4>
          <span className="text-xs text-gray-500">
            {`${mode.toUpperCase()} / Min: ${min} / Max: ${max}`}
          </span>
        </div>
        {required && (
          <div className="text-white bg-red-500 rounded-md p-1 text-xs">
            Required
          </div>
        )}
      </div>

      {options.map((opt) => (
        <div
          key={`${name}_${opt.id}`}
          className="f-btw pt-2 mt-2 border-t text-sm"
        >
          <div>{`${opt.name}${
            opt.value ? `(+$${opt.value.toFixed(2)})` : ""
          }`}</div>
          <div>
            {mode === "radio" && <RadioComponent />}
            {mode === "checkbox" && <CheckBoxComponent />}
            {mode === "count" && <CountComponent />}
          </div>
        </div>
      ))}
    </div>
  );
};

const RadioComponent = () => {
  return (
    <div className="fccc text-lg text-gray-300">
      <RadioUncheckedIcon />
    </div>
  );
};

const CheckBoxComponent = () => {
  return (
    <div className="fccc text-lg text-gray-300">
      <UncheckedIcon />
    </div>
  );
};

const CountComponent = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="fccc text-lg text-gray-300">
        <MinusIcon />
      </div>
      <div className="fccc">1</div>
      <div className="fccc text-lg text-gray-300">
        <PlusIcon />
      </div>
    </div>
  );
};
