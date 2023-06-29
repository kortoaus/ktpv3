"use client";
import { ProductOptionGroupEditor } from "@/components/ProductOptionGroupEditor";
import PlusIcon from "@/components/icons/PlusIcon";
import { ProductOptionGroup, ProductOptionGroupMode } from "@/types/Product";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = PopUpProps & {
  val: ProductOptionGroup[];
  setValue: (val: ProductOptionGroup[]) => void;
};

export default function ProductOptionDrawer({
  val,
  setValue,
  open,
  onClose,
}: Props) {
  const [groups, setGroups] = useState<ProductOptionGroup[]>([]);

  useEffect(() => {
    if (open) {
      setGroups(val);
    } else {
      setGroups([]);
    }
  }, [open, val]);

  const addGroupHandler = (mode: ProductOptionGroupMode) => {
    const newGroup: ProductOptionGroup = {
      id: new Date().getTime(),
      mode,
      name: "New Group",
      required: mode === "radio" ? true : false,
      min: mode === "radio" ? 1 : 0,
      max: mode === "radio" ? 1 : 0,
      options: [],
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const removeHandler = (id: number) => {
    const cp = groups.filter((c) => c.id !== id).map((c) => ({ ...c }));
    setGroups([...cp]);
  };

  const validateGroups = () => {
    const groupOk = groups.every((group) => {
      // Group Properties
      const { name, mode, required, min, max, options } = group;
      if (name.length === 0) {
        const msg = `Group Name can not be empty!`;
        window.alert(msg);
        return false;
      }
      if (min > max && mode !== "count") {
        const msg = `[${name}] Min can not be greater than Max!`;
        window.alert(msg);
        return false;
      }
      if (mode !== "count" && max < 1) {
        const msg = `[${name}] Max can not be less than 1!`;
        window.alert(msg);
        return false;
      }
      if (mode === "radio" && (min !== 1 || max !== 1 || !required)) {
        const msg = `[${name}] Inavlid Properties!`;
        window.alert(msg);
        return false;
      }
      // Option Properties
      const optionOK = options.every((option) => {
        if (option.name.length === 0) {
          const msg = `[${name}] Option Name can not be empty!`;
          window.alert(msg);
          return false;
        }
        return true;
      });

      if (optionOK) {
        return true;
      } else {
        return false;
      }
    });
    return groupOk;
  };

  const sanitizeGroups = () => {
    const cp = groups
      .filter((g) => g.options.length !== 0)
      .map((group) => {
        let max = group.max;

        if (group.mode === "radio") {
          max = 1;
        }

        if (group.mode === "checkbox") {
          if (group.options.length < max) {
            max = group.options.length;
          }
        }

        return {
          ...group,
          min: group.mode === "radio" ? 1 : group.min,
          max,
          required: Boolean(group.min),
        };
      });

    return cp;
  };

  const updateHandler = () => {
    if (!validateGroups()) {
      return;
    }

    const sanitized = sanitizeGroups();
    setValue(sanitized);
    onClose();
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateHandler()}
              className="BasicBtn bg-blue-500 text-white border-blue-500"
            >
              Save
            </button>
            <button
              onClick={() => {
                const msg = `Changes will not be applied., Do you want to close?`;
                if (!window.confirm(msg)) {
                  return;
                } else {
                  onClose();
                }
              }}
              className="BasicBtn bg-red-500 text-white border-red-500"
            >
              Close
            </button>
          </div>
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
                remove={() => removeHandler(group.id)}
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
