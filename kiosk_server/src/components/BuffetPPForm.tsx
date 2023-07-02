"use client";
import { BuffetClass } from "@/types/model";
import React, { useState } from "react";
import NumPad from "./NumPad";
import Decimal from "decimal.js";

export type BuffetDataType = {
  id?: number;
  ppA: number;
  ppB: number;
  ppC: number;
};

type Props = {
  buffet?: BuffetClass;
  val: BuffetDataType;
  setVal: (val: BuffetDataType) => void;
};

type KeyType = "A" | "B" | "C";

export default function BuffetPPForm({ buffet, setVal, val }: Props) {
  const [target, setTarget] = useState<KeyType>("A");
  const [counter, setCounter] = useState<BuffetDataType>({
    ...val,
  });

  if (!buffet) {
    return null;
  }

  const onChangeHandler = (val: string) => {
    const prev = { ...counter };
    const newVal = { ...prev, [`pp${target}`]: Number(val) };
    setCounter(newVal);
    setVal(newVal);
  };

  const clearLine = (target: KeyType) => {
    const prev = { ...counter };
    const newVal = { ...prev, [`pp${target}`]: 0 };
    setCounter(newVal);
    setVal(newVal);
  };

  const getTotal = () => {
    const { priceA, priceB, priceC } = buffet;
    const { ppA, ppB, ppC } = counter;

    const A = new Decimal(ppA).mul(priceA);
    const B = new Decimal(ppB).mul(priceB);
    const C = new Decimal(ppC).mul(priceC);
    return A.plus(B).plus(C).toNumber();
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-start justify-between">
          <CounterLine
            clear={() => clearLine("A")}
            selected={target === "A"}
            label={`${buffet.nameA} / $${buffet.priceA.toFixed(2)}`}
            value={counter["ppA"]}
            setTarget={() => setTarget("A")}
          />
          <CounterLine
            clear={() => clearLine("B")}
            selected={target === "B"}
            label={`${buffet.nameB} / $${buffet.priceB.toFixed(2)}`}
            value={counter["ppB"]}
            setTarget={() => setTarget("B")}
          />
          <CounterLine
            clear={() => clearLine("C")}
            selected={target === "C"}
            label={`${buffet.nameC} / $${buffet.priceC.toFixed(2)}`}
            value={counter["ppC"]}
            setTarget={() => setTarget("C")}
          />

          <div className="w-full">
            <div className="text-sm mb-1 font-medium">Total</div>
            <div
              className={`flex items-center justify-end px-4 border mb-4 py-2`}
            >
              <span className="text-lg font-medium mr-1">{`$${Number(
                getTotal()
              )}`}</span>
            </div>
          </div>
        </div>
        <div>
          <NumPad
            val={counter[`pp${target}`] + ""}
            setVal={(val) => onChangeHandler(val)}
          />
        </div>
      </div>
    </div>
  );
}

type CounterLineProps = {
  label: string;
  value: number;
  setTarget: () => void;
  selected: boolean;
  clear: () => void;
};

const CounterLine = ({
  label,
  value,
  setTarget,
  selected,
  clear,
}: CounterLineProps) => {
  return (
    <div
      className="w-full"
      onClick={() => {
        if (selected) {
          clear();
        } else {
          setTarget();
        }
      }}
    >
      <div className="text-sm mb-1 font-medium">{label}</div>
      <div
        className={`flex items-center justify-end px-4 border mb-4 py-2 ${
          selected ? "bg-blue-500 text-white" : ""
        }`}
      >
        <span className="text-lg font-medium mr-1">{`${Number(value)}`}</span>
        <span className="text-xs">People</span>
      </div>
    </div>
  );
};
