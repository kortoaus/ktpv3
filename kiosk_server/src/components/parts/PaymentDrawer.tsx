"use client";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import NumPad from "../NumPad";
import Decimal from "decimal.js";
import DollarIcon from "../icons/DollarIcon";
import useShop from "@/libs/useShop";
import { customerPropertyType } from "@/types/Sale";
import DataLoading from "../ui/DataLoading";

export type PaymentDataType = {
  subTotal: number;
  charged: number;
  discount: number;
  total: number;
  cash: number;
  credit: number;
  creditSurcharge: number;
  rest: number;
  change: number;
  creditPaid: number;
  cashPaid: number;
  customerProperty: string;
};

export type PaymentStateType = {
  cash: number;
  credit: number;
  surcharge: number;
  discount: number;
};

type Props = PopUpProps & {
  amount: number;
  pay: (val: PaymentDataType) => void;
};

const init: PaymentStateType = {
  cash: 0,
  credit: 0,
  surcharge: 0,
  discount: 0,
};

type TargetType = "cash" | "credit" | "discount" | "surcharge";

export default function PaymentDrawer({ open, onClose, pay, amount }: Props) {
  const [loading, setLoading] = useState(false);
  const { shop } = useShop();
  const [target, setTarget] = useState<TargetType>("cash");
  const [data, setData] = useState<PaymentStateType>(init);

  const onChangeHandler = (val: string) => {
    const newVal = val ? new Decimal(val).div(100).toNumber() : 0;
    setData((prev) => {
      return { ...prev, [target]: newVal };
    });
  };

  const onClickHandler = (tg: TargetType) => {
    if (target === tg) {
      if (Number(data[target]) === 0) {
        if (target === "surcharge") {
          return;
        }
        setData((prev) => ({ ...prev, [tg]: rest }));
      } else {
        setData((prev) => ({ ...prev, [tg]: 0 }));
      }
    } else {
      setTarget(tg);
    }
  };

  const payHandler = (customerProperty: customerPropertyType) => {
    if (loading) {
      return;
    }

    setLoading(true);

    const {
      ok,
      msg,
      subTotal,
      charged,
      discount,
      total,
      cash,
      credit,
      creditSurcharge,
      creditTotal,
      rest,
      change,
    } = getData();

    if (!ok) {
      window.alert(msg || `Payment Data is not fullfilled!`);
      return;
    }

    const cashPaid = new Decimal(cash || 0).minus(change || 0).toNumber();

    pay({
      subTotal: subTotal || 0,
      charged: charged || 0,
      discount: discount || 0,
      total: total || 0,
      cash: cash || 0,
      credit: credit || 0,
      creditSurcharge: creditSurcharge || 0,
      creditPaid: creditTotal || 0,
      rest: rest || 0,
      change: change || 0,
      cashPaid: cashPaid || 0,
      customerProperty,
    });
  };

  useEffect(() => {
    if (!open) {
      setData(init);
      setLoading(false);
    }
  }, [open]);

  const getData = () => {
    if (!shop) {
      return {
        ok: false,
        msg: "Shop Not Loaded!",
      };
    }
    const { discount, cash, credit, surcharge } = data;
    let origin = new Decimal(amount);

    const charged = new Decimal(
      Number(new Decimal(origin.div(100).mul(surcharge).toFixed(2)))
    );
    origin = origin.plus(charged);

    const creditP = shop ? shop.creditRate : 0;
    const creditSurcharge = new Decimal(
      Number(new Decimal(credit).div(100).mul(creditP).toFixed(2))
    );
    const creditTotal = creditSurcharge.plus(credit);

    const discounted = origin.minus(discount);
    if (discounted.toNumber() < 0) {
      return {
        ok: false,
        msg: "Discount amount can not be greater than total!",
      };
    }

    // After Credit
    const credited = discounted.minus(credit);
    if (credited.toNumber() < 0) {
      return {
        ok: false,
        msg: "Credit amount can not be greater than total!",
      };
    }

    const rest = credited.minus(cash).toNumber();

    const ok = rest <= 0;

    return {
      ok,
      msg: "",
      subTotal: amount,
      charged: charged.toNumber(),
      total: discounted.toNumber(),
      cash,
      credit,
      creditSurcharge: creditSurcharge.toNumber(),
      creditTotal: creditTotal.toNumber(),
      discount,
      rest: ok ? 0 : rest,
      change: !ok ? 0 : Math.abs(rest),
    };
  };

  const {
    subTotal,
    charged,
    discount,
    total,
    cash,
    credit,
    creditSurcharge,
    creditTotal,
    rest,
    change,
    ok,
    msg,
  } = getData();

  // 학생, 20-30대, 40대 이상

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      {loading ? (
        <div className="w-[700px] h-full">
          <DataLoading />
        </div>
      ) : (
        <div className="PaymentDrawer">
          <div>
            <div>
              <h2 className="pb-2 border-b">Payment</h2>
              <ReceivedLine label="Sub Total" value={subTotal} />
              <ReceivedLine label="Surcharge" value={charged} />
              <ReceivedLine
                label="Discount"
                value={discount}
                negative={true}
                accent="text-red-500"
              />
              <ReceivedLine
                label="Total"
                value={total}
                accent="text-blue-500 font-medium"
              />
              <ReceivedLine label="Cash Pay" value={cash} />
              <ReceivedLine label="Credit Pay" value={credit} />
              <ReceivedLine label="Credit Surcharge" value={creditSurcharge} />
              <ReceivedLine label="Rest" value={rest} accent="text-red-500" />
              <div className="bg-red-500 text-white">
                <ReceivedLine label="Receive Cash" value={cash} />
                <ReceivedLine label="Receive Credit" value={creditTotal} />
              </div>
              <div className="bg-green-500 text-white">
                <ReceivedLine label="Change" value={change} />
              </div>
            </div>

            {msg && (
              <div className="text-red-500 text-center my-4 font-medium">
                {msg}
              </div>
            )}
            {ok && (
              <div className="mt-4">
                <div className="PayBtns">
                  <button onClick={() => payHandler("MS")}>MS</button>
                  <button onClick={() => payHandler("FS")}>FS</button>
                  <button onClick={() => payHandler("MY")}>MY</button>
                  <button onClick={() => payHandler("FY")}>FY</button>
                  <button onClick={() => payHandler("MM")}>MM</button>
                  <button onClick={() => payHandler("FM")}>FM</button>
                </div>
              </div>
            )}
          </div>

          {/* Pads */}
          <div className="">
            <div className="fccc gap-2 mb-8">
              <DataLine
                value={data["cash"]}
                onClick={() => onClickHandler("cash")}
                label="Cash"
                selected={target === "cash"}
              />
              <DataLine
                value={data["credit"]}
                onClick={() => onClickHandler("credit")}
                label={`Credit${
                  shop?.creditRate ? ` / ${shop?.creditRate}% Surcharge` : ""
                }`}
                selected={target === "credit"}
              />
              <DataLine
                value={data["discount"]}
                onClick={() => onClickHandler("discount")}
                label="Discount"
                selected={target === "discount"}
              />
              <DataLine
                value={data["surcharge"]}
                onClick={() => onClickHandler("surcharge")}
                label="Surcharge(%)"
                selected={target === "surcharge"}
              />
            </div>
            <div>
              <NumPad
                val={new Decimal(data[target]).mul(100).toNumber() + ""}
                setVal={onChangeHandler}
                useDot={false}
                useDZ={true}
              />
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

type DataLineProps = {
  value: number;
  label: string;
  selected: boolean;
  onClick: () => void;
};

function DataLine({ value, label, onClick, selected }: DataLineProps) {
  return (
    <div onClick={() => onClick()} className="w-full">
      <div className="mb-1 font-medium">{label}</div>
      <div
        className={`f-btw p-2 border text-2xl ${
          selected ? "bg-blue-500 text-white" : ""
        }`}
      >
        <div>
          <DollarIcon />
        </div>
        <div>{value.toFixed(2)}</div>
      </div>
    </div>
  );
}

type ReceivedLineProps = {
  label: string;
  value?: number;
  accent?: string;
  negative?: boolean;
};

function ReceivedLine({
  label,
  value,
  accent = "",
  negative = false,
}: ReceivedLineProps) {
  if (!value) {
    return null;
  }

  return (
    <div className="py-2 border-b f-btw px-2">
      <div className="font-medium">{label}</div>
      <div className={`text-lg ${accent}`}>{`${
        negative ? "-" : ""
      }$${value.toFixed(2)}`}</div>
    </div>
  );
}
