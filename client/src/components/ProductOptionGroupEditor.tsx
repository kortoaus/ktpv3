"use  client";

import { ProductOptionGroup, ProductOptionValue } from "@/types/Product";
import React from "react";
import CheckedIcon from "./icons/CheckedIcon";
import UncheckedIcon from "./icons/UncheckedIcon";
import PlusIcon from "./icons/PlusIcon";
import ArrowUpIcon from "./icons/ArrowUpIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";

type Props = {
  group: ProductOptionGroup;
  setVal: (val: ProductOptionGroup) => void;
  remove: () => void;
};

export const ProductOptionGroupEditor = ({ group, setVal, remove }: Props) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    let val: any = value;

    if (name === "min" || name === "max") {
      val = Math.ceil(+val);
    }

    if (name === "required") {
      val = val === "on" ? true : false;
    }

    const newGroup = {
      ...group,
      [name]: val,
    };

    setVal(newGroup);
  };

  const addLineHandler = () => {
    const newOption: ProductOptionValue = {
      id: new Date().getTime(),
      name: "New Option",
      value: 0,
    };

    const newGroup = {
      ...group,
      options: [...group.options, newOption],
    };

    setVal(newGroup);
  };

  const lineOnChangeHandler = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const cp = group.options.map((c) => ({ ...c }));
    const idx = cp.findIndex((opt) => opt.id === id);
    if (idx === -1) {
      return;
    }

    const { name, value } = e.target;

    let val: any = value;

    if (name === "value") {
      val = Number((+val).toFixed(2));
    }

    cp[idx] = {
      ...cp[idx],
      [name]: val,
    };

    setVal({
      ...group,
      options: [...cp],
    });
  };

  const removeLineHandler = (id: number) => {
    const cp = group.options.filter((c) => c.id !== id).map((c) => ({ ...c }));

    setVal({
      ...group,
      options: [...cp],
    });
  };

  const reorderHandler = (index: number, direction: "up" | "down" = "up") => {
    const cp = group.options.map((c) => ({ ...c }));

    if (direction === "up" && index > 0) {
      // Move Up
      const temp = cp[index];
      cp[index] = cp[index - 1];
      cp[index - 1] = temp;
    }

    if (direction === "down" && index < cp.length - 1) {
      // Move Down
      const temp = cp[index];
      cp[index] = cp[index + 1];
      cp[index + 1] = temp;
    }

    setVal({
      ...group,
      options: [...cp],
    });
  };

  return (
    <div className="ProductOptionGroupEditor">
      {/* Editor Header */}
      <div className="EditorHeader">
        <h4 className="">{group.mode.toUpperCase()} GROUP</h4>
        <button onClick={() => remove()} className="text-red-500 text-sm">
          {`Remove This Group`}
        </button>
      </div>

      {/* Group Header */}
      <form onSubmit={(e) => e.preventDefault()} className="OptionHeader">
        <div className="col-span-8 col">
          <label>Group Name</label>
          <input
            name="name"
            type="text"
            value={group.name}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        {/* <div className="col-span-2 col">
          <label>Required</label>
          <div
            onClick={() => requireHandler()}
            className="hover:cursor-pointer flex items-center h-full text-blue-500"
          >
            {group.required ? (
              <CheckedIcon size={24} />
            ) : (
              <UncheckedIcon size={24} />
            )}
          </div>
        </div> */}
        <div className="col-span-2 col">
          <label>Min</label>
          <input
            name="min"
            type="number"
            value={group.min}
            step={0}
            min={0}
            disabled={group.mode === "radio"}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div className="col-span-2 col">
          <label>Max</label>
          <input
            name="max"
            type="number"
            value={group.max}
            step={0}
            min={0}
            disabled={group.mode === "radio"}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
      </form>

      {/* Options Container */}
      <div className="OptionLine">
        {/* Header */}
        <div className="OptionLineWrapper font-medium text-gray-500 text-sm border-b">
          <div className="col">Up</div>
          <div className="col">Dn</div>
          <div className="col col-span-6">Name</div>
          <div className="col col-span-2">Value</div>
          <div className="col col-span-2">Remove</div>
        </div>

        {/* Lines */}
        {group.options.map((option, index) => {
          return (
            <div className="OptionLineWrapper border-b" key={option.id}>
              <div className="col fccc">
                <button onClick={() => reorderHandler(index, "up")}>
                  <ArrowUpIcon
                    size={24}
                    className="text-gray-500 hover:text-blue-500"
                  />
                </button>
              </div>
              <div className="col fccc">
                <button onClick={() => reorderHandler(index, "down")}>
                  <ArrowDownIcon
                    size={24}
                    className="text-gray-500 hover:text-blue-500"
                  />
                </button>
              </div>
              <div className="col-span-6 col">
                <input
                  name="name"
                  type="text"
                  value={option.name}
                  onChange={(e) => lineOnChangeHandler(option.id, e)}
                />
              </div>
              <div className="col-span-2 col">
                <input
                  name="value"
                  type="number"
                  step={0.01}
                  value={option.value}
                  onChange={(e) => lineOnChangeHandler(option.id, e)}
                />
              </div>
              <div className="col-span-2 col fccc">
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeLineHandler(option.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Line Btn */}
      <button
        className="w-full BasicBtn bg-green-500 text-white justify-center border-green-500"
        onClick={() => addLineHandler()}
      >
        <PlusIcon />
        <span>Add Option</span>
      </button>
    </div>
  );
};
