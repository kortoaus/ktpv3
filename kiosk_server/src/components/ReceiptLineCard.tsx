import { SaleLineTotal } from "@/libs/util";
import { SaleLineType } from "@/types/Sale";
import React from "react";

type Props = {
  line: SaleLineType;
  remove: () => void;
};

export default function ReceiptLineCard({ remove, line }: Props) {
  const { description, qty, options, price, discount, cancelled, total } = line;

  return (
    <button
      className={`ReceiptLineCard border-b p-2 w-full text-left ${
        cancelled ? `text-red-500 line-through` : ""
      }`}
      onClick={() => {
        if (!cancelled) {
          remove();
        }
      }}
    >
      <div className="f-btw">
        <div className="font-medium">{`${description}`}</div>
      </div>

      {/* Option */}
      {options.length !== 0 && (
        <div className="options">
          {options.map((opt, idx) => {
            return (
              <div key={idx} className="pl-2 f-btw">
                <div>{`${opt.qty} X ${opt.name}${
                  opt.value ? `($${opt.value.toFixed(2)})` : ``
                }`}</div>
              </div>
            );
          })}
        </div>
      )}

      {true && (
        <>
          <div className="f-btw">
            <div>{`$${price.toFixed(2)} X ${qty}`}</div>
            <div>{`$${total}`}</div>
          </div>
          {Boolean(discount) && (
            <div className="text-right">{`@D/C: $${discount.toFixed(2)}`}</div>
          )}
        </>
      )}
    </button>
  );
}
