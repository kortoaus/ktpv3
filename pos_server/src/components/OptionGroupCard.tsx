import { ProductOptionGroup, ProductOptionValue } from "@/types/Product";
import React from "react";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import RadioUncheckedIcon from "./icons/RadioUncheckedIcon";
import UncheckedIcon from "./icons/UncheckedIcon";
import { SelectedOptionType } from "@/types/Sale";
import CheckedIcon from "./icons/CheckedIcon";
import RadioCheckedIcon from "./icons/RadioCheckedIcon";

type Props = {
  options: SelectedOptionType[];
  addOption: (val: SelectedOptionType[]) => void;
  group: ProductOptionGroup;
  ok: boolean;
};

const iconSize = 24;

export const OptionGroupCard = ({
  group: { id: gId, name, max, min, mode, options: groupOptions },
  ok,
  addOption,
  options,
}: Props) => {
  const addOptionHandler = (option: ProductOptionValue, qty: number) => {
    let cp = options.map((op) => ({ ...op }));

    if (mode === "radio") {
      cp = cp.filter((c) => c.gId !== gId);
      const newVal: SelectedOptionType = {
        gId,
        oId: option.id,
        name: option.name,
        qty,
        id: new Date().getTime(),
        value: option.value,
      };
      cp.push(newVal);
      addOption([...cp]);
      return;
    }

    if (mode === "checkbox") {
      const exist = cp.find((cp) => gId === cp.gId && cp.oId === option.id);
      if (exist) {
        cp = cp.filter((c) => c.oId !== option.id);
      } else {
        const newVal: SelectedOptionType = {
          gId,
          oId: option.id,
          name: option.name,
          qty,
          id: new Date().getTime(),
          value: option.value,
        };
        cp.push(newVal);
      }
      addOption([...cp]);
      return;
    }

    if (mode === "count") {
      cp = cp.filter((c) => c.oId !== option.id);
      if (qty !== 0) {
        const newVal: SelectedOptionType = {
          gId,
          oId: option.id,
          name: option.name,
          qty,
          id: new Date().getTime(),
          value: option.value,
        };
        cp.push(newVal);
      }
      addOption([...cp]);
      return;
    }

    return;
  };

  const getChecked = (optionId: number) => {
    return Boolean(options.find((opt) => opt.oId === optionId));
  };

  const getQty = (optionId: number) => {
    return options.find((opt) => opt.oId === optionId)?.qty || 0;
  };

  const getMaxed = () => {
    if (mode === "count" && max == 0) {
      return false;
    }
    const count = options
      .filter((opt) => opt.gId === gId)
      .reduce((a, b) => a + b.qty, 0);
    return count >= max;
  };

  return (
    <div className="w-full border p-2 rounded-md">
      {/* Group */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <span>{name}</span>
          {min !== 0 && (
            <span className="text-white bg-red-500 rounded-md px-1 text-xs">
              Required
            </span>
          )}
        </h4>

        {ok && (
          <span className="bg-blue-500 text-white text-xs px-1 rounded-md">
            OK
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500">
        {`${mode.toUpperCase()} / Min: ${min}${max ? ` / Max: ${max}` : ""}`}
      </div>

      {groupOptions.map((opt) => (
        <div
          key={`${name}_${opt.id}`}
          className="f-btw pt-2 mt-2 border-t text-sm"
        >
          <div>{`${opt.name}${
            opt.value ? `(+$${opt.value.toFixed(2)})` : ""
          }`}</div>
          <div>
            {mode === "radio" && (
              <RadioComponent
                checked={getChecked(opt.id)}
                handler={(qty) => addOptionHandler(opt, qty)}
              />
            )}
            {mode === "checkbox" && (
              <CheckBoxComponent
                checked={getChecked(opt.id)}
                handler={(qty) => addOptionHandler(opt, qty)}
              />
            )}
            {mode === "count" && (
              <CountComponent
                maxed={getMaxed()}
                qty={getQty(opt.id)}
                handler={(qty) => addOptionHandler(opt, qty)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

type OptionCompProps = {
  handler: (val: number) => void;
};

const RadioComponent = ({
  handler,
  checked,
}: OptionCompProps & { checked: boolean }) => {
  return (
    <button onClick={() => handler(1)} className="fccc text-lg text-gray-300">
      {checked ? (
        <RadioCheckedIcon className="text-blue-500" size={iconSize} />
      ) : (
        <RadioUncheckedIcon size={iconSize} />
      )}
    </button>
  );
};

const CheckBoxComponent = ({
  handler,
  checked,
}: OptionCompProps & { checked: boolean }) => {
  return (
    <button onClick={() => handler(1)} className="fccc text-lg text-gray-300">
      {checked ? (
        <CheckedIcon className="text-blue-500" size={iconSize} />
      ) : (
        <UncheckedIcon size={iconSize} />
      )}
    </button>
  );
};

const CountComponent = ({
  handler,
  qty,
  maxed,
}: OptionCompProps & { qty: number; maxed: boolean }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        className="fccc text-lg text-gray-300"
        onClick={() => {
          if (qty > 0) {
            handler(qty - 1);
          }
        }}
      >
        <MinusIcon size={iconSize} />
      </button>

      <div className="fccc text-blue-500">{qty}</div>

      <button
        className="fccc text-lg text-gray-300"
        onClick={() => {
          if (!maxed) {
            handler(qty + 1);
          }
        }}
      >
        <PlusIcon size={iconSize} />
      </button>
    </div>
  );
};
