"use client";
import { ProductOptionGroupEditor } from "@/components/ProductOptionGroupEditor";
import PlusIcon from "@/components/icons/PlusIcon";
import { ProductOptionGroup, ProductOptionGroupMode } from "@/types/Product";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React, { useState } from "react";

type Props = PopUpProps & {};

export default function ProductOptionDrawer({ open, onClose }: Props) {
  const [groups, setGroups] = useState<ProductOptionGroup[]>([]);

  const addGroupHandler = (mode: ProductOptionGroupMode) => {
    const newGroup: ProductOptionGroup = {
      id: new Date().getTime(),
      mode,
      name: "New Group",
      required: false,
      min: 1,
      max: 1,
      options: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const onChangeHandler = (id: number, newVal: ProductOptionGroup) => {
    const cp = groups.map((gr) => ({ ...gr }));
    const idx = cp.findIndex((c) => c.id === id);
    if (idx === -1) {
      return;
    }

    cp[idx] = {
      ...newVal,
    };

    setGroups([...cp]);
  };

  return (
    <Drawer anchor="top" open={open} onClose={() => onClose()}>
      <section className="p-4 mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b">
          <h2>Product Options</h2>
          <button className="BasicBtn bg-red-500 text-white border-red-500">
            Close
          </button>
        </div>
        {/* Toolbar */}
        <div className="grid grid-cols-3 gap-4 pb-4 mb-4 border-b">
          <button
            onClick={() => addGroupHandler("radio")}
            className="BasicBtn bg-purple-500 text-white !py-2 justify-center"
          >
            <PlusIcon /> <span>Add Radio</span>
          </button>
          <button
            onClick={() => addGroupHandler("checkbox")}
            className="BasicBtn bg-purple-500 text-white !py-2 justify-center"
          >
            <PlusIcon /> <span>Add CheckBox</span>
          </button>
          <button
            onClick={() => addGroupHandler("count")}
            className="BasicBtn bg-purple-500 text-white !py-2 justify-center"
          >
            <PlusIcon /> <span>Add Count</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {groups.map((group) => {
            return (
              <ProductOptionGroupEditor
                setVal={(val) => onChangeHandler(group.id, val)}
                key={group.id}
                group={group}
              />
            );
          })}
        </div>
      </section>
    </Drawer>
  );
}
