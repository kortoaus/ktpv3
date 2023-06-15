"use client";
import React, { useEffect, useState } from "react";
import NumPad from "./NumPad";
import Decimal from "decimal.js";
import ResetIcon from "./icons/ResetIcon";

type Props = {
  setVal: (val: number) => void;
};

type Counts = {
  [key: string]: number;
};

const weight: Counts = {
  "100": 100,
  "50": 50,
  "20": 20,
  "10": 10,
  "5": 5,
  "2": 2,
  "1": 1,
  "0.5": 0.5,
  "0.2": 0.2,
  "0.1": 0.1,
  "0.05": 0.05,
};

const init: Counts = {
  "100": 0,
  "50": 0,
  "20": 0,
  "10": 0,
  "5": 0,
  "2": 0,
  "1": 0,
  "0.5": 0,
  "0.2": 0,
  "0.1": 0,
  "0.05": 0,
};

export default function CashCounter({ setVal }: Props) {
  const [count, setCount] = useState<Counts>(init);
  const [target, setTarget] = useState("100");

  const getValue = (key: string) => {
    return Number(count[key]) || 0;
  };

  const onChangeHandler = (val: string) => {
    setCount((prev) => ({
      ...prev,
      [target]: Number(val),
    }));
    // return Number(count[target]) || 0;
  };

  const clickHandler = (key: string) => {
    if (target === key) {
      setCount((prev) => ({ ...prev, [key]: 0 }));
    } else {
      setTarget(key);
    }
  };

  const getTotal = () => {
    let total = 0;
    for (const k in count) {
      const ct = count[k] || 0;
      const wt = weight[k] || 0;
      const val = new Decimal(ct).mul(wt);
      total = new Decimal(total).plus(val).toNumber();
    }
    return total;
  };

  useEffect(() => {
    setVal(getTotal());
  }, [getTotal, count]);

  const lineTotal = (key: string) => {
    const ct = count[key] || 0;
    const wt = weight[key] || 0;
    const val = new Decimal(ct).mul(wt);
    return val.toNumber();
  };

  return (
    <div className="CashCounter">
      {/* Lines */}
      <div className="LineContainer">
        <CashLine
          getTotal={lineTotal}
          weight="100"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "100"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="50"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "50"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="20"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "20"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="10"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "10"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="5"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "5"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="2"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "2"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="1"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "1"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="0.5"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "0.5"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="0.2"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "0.2"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="0.1"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "0.1"}
        />
        <CashLine
          getTotal={lineTotal}
          weight="0.05"
          getValue={getValue}
          onClick={clickHandler}
          selected={target === "0.05"}
        />
        <div className={`p-2 f-btw border-b bg-blue-500 text-white`}>
          <div className="label">Total</div>
          <div className="value">${getTotal().toFixed(2)}</div>
        </div>
      </div>

      {/* Numpad */}
      <div className="bg-white">
        <div>
          <h4>{`$${target}: ${getValue(target)}`}</h4>
        </div>
        <NumPad
          val={getValue(target) + ""}
          setVal={(val) => onChangeHandler(val)}
          useDot={false}
        />
        <button
          className="BasicBtn w-full mt-2 bg-red-500 text-white justify-center text-2xl !border-0"
          onClick={() => {
            const msg = `Reset?`;
            if (!window.confirm(msg)) {
              return;
            }
            setCount(init);
          }}
        >
          <ResetIcon size={24} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

type CashLineProps = {
  weight: string;
  selected: boolean;
  getTotal: (key: string) => number;
  getValue: (key: string) => number;
  onClick: (key: string) => void;
};

const CashLine = ({
  weight,
  getValue,
  selected,
  onClick,
  getTotal,
}: CashLineProps) => {
  return (
    <div
      className={`CashLine ${selected ? "selected" : ""}`}
      onClick={() => onClick(weight)}
    >
      <div className="label col col-span-2">{`$${weight}`}</div>
      <div className="col text-sm text-gray-500 fccc">X</div>
      <div className="count col col-span-2">{getValue(weight)}</div>
      <div className="total col col-span-7 justify-end">
        ${getTotal(weight).toFixed(2)}
      </div>
    </div>
  );
};
