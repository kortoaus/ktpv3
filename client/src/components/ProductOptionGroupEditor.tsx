"use  client";

import { ProductOptionGroup } from "@/types/Product";
import React from "react";
import CheckedIcon from "./icons/CheckedIcon";
import UncheckedIcon from "./icons/UncheckedIcon";

type Props = {
  group: ProductOptionGroup;
  setVal: (val: ProductOptionGroup) => void;
};

export const ProductOptionGroupEditor = ({ group, setVal }: Props) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    let val: any = value;

    if (name === "min" || name === "max") {
      val = Math.ceil(+val);
    }

    console.log(name, value);

    if (name === "required") {
      val = val === "on" ? true : false;
    }

    const newGroup = {
      ...group,
      [name]: val,
    };

    setVal(newGroup);
  };

  const requireHandler = () => {
    const newGroup = {
      ...group,
      required: !group.required,
    };

    setVal(newGroup);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="ProductOptionGroupEditor border rounded-md p-4"
    >
      <div className="OptionHeader grid grid-cols-12 border-b mb-2 pb-2">
        <div className="col-span-6 col">
          <label>Group Name</label>
          <input
            name="name"
            type="text"
            value={group.name}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div className="col-span-2 col">
          <label>Required</label>
          <div
            onClick={() => requireHandler()}
            className="hover:cursor-pointer"
          >
            {group.required ? <CheckedIcon /> : <UncheckedIcon />}
          </div>
        </div>
        <div className="col-span-2 col">
          <label>Min</label>
          <input
            name="min"
            type="number"
            value={group.min}
            step={0}
            min={0}
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
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
      </div>
    </form>
  );
};
