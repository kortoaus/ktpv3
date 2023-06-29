"use client";
import { time } from "@/libs/util";
import { ProductOptionGroup, SelectedOptionType } from "@/types/Product";
import { SaleWithLines } from "@/types/Sale";
import { SaleLine } from "@/types/model";
import Decimal from "decimal.js";
import React, { useState } from "react";

type Props = {
  sale: SaleWithLines;
};

export default function ReceiptDetail({
  sale: {
    id,
    shiftId,
    tableName,
    ppA,
    ppB,
    ppC,
    pp,
    openStaff,
    closeStaff,
    openAt,
    closedAt,
    buffetStarted,
    logs,
    subTotal,
    charged,
    total,
    cash,
    credit,
    creditSurcharge,
    creditPaid,
    cashPaid,
    discount,
    change,
    customerProperty,
    lines,
  },
}: Props) {
  const [zero, setZero] = useState(false);
  const filteredLine = !zero ? lines.filter((li) => li.price !== 0) : lines;

  const parsedLogs: string[] = logs.split("\n");

  return (
    <div className="fccc mt-8">
      <div className="grid grid-cols-2 gap-4">
        {/* Receipt */}
        <div className="border p-4 w-full max-w-sm">
          <div className="border-b pb-2 mb-2">
            <h2 className="border-b-2 mb-2 pb-2">Receipt</h2>
            <div className="text-sm">
              <div>{time(closedAt).format("DD MMM YYYY HH:mm")}</div>
              <div>{`Table: #${tableName}`}</div>
              <div>{`T: ${pp} / A: ${ppA} / B: ${ppB} / C: ${ppC} / ${customerProperty}`}</div>
            </div>
          </div>

          {/* Lines */}
          <div className="border-b-2 mb-2">
            {filteredLine.map((line) => {
              return <LineCard key={line.id} line={line} />;
            })}
          </div>

          {/* Payments */}
          <div>
            <ReceivedLine label="Sub Total" value={subTotal} />
            <ReceivedLine label="Surcharge" value={charged} />
            <ReceivedLine
              label="Discount"
              value={discount}
              negative={true}
              accent="text-red-500"
            />
            <ReceivedLine label="Total" value={total} accent="font-medium" />
            <ReceivedLine label="Cash Pay" value={cash} />
            <ReceivedLine label="Credit Pay" value={credit} />
            <ReceivedLine label="Credit Surcharge" value={creditSurcharge} />
            <ReceivedLine
              label="Paid Cash"
              value={cashPaid}
              accent="text-blue-500"
            />
            <ReceivedLine
              label="Paid Credit"
              value={creditPaid}
              accent="text-blue-500"
            />
            <ReceivedLine
              label="Change"
              value={change}
              accent="text-green-500"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="mb-4 text-sm">
            <h3>Sales Data</h3>
            <div className="text-xs">{id}</div>

            <div className="py-1 border-b f-btw">
              <div>Date</div>
              <div>{`${time(openAt).format("DD MMM YYYY")}`}</div>
            </div>

            <div className="py-1 border-b f-btw">
              <div>Opened At</div>
              <div>{time(openAt).format("HH:mm")}</div>
            </div>

            <div className="py-1 border-b f-btw">
              <div>Opened By</div>
              <div>{openStaff}</div>
            </div>

            <div className="py-1 border-b f-btw">
              <div>Closed At</div>
              <div>{time(closedAt).format("HH:mm")}</div>
            </div>

            <div className="py-1 border-b f-btw">
              <div>Closed By</div>
              <div>{closeStaff}</div>
            </div>
          </div>

          <h3>Logs</h3>
          {parsedLogs.map((log, idx) => (
            <LogLine key={`log_${idx}`} log={log} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LineCard({ line }: { line: SaleLine }) {
  const { desc, qty, total, price, options: opt, cancelled } = line;

  const options: SelectedOptionType[] = JSON.parse(opt);

  return (
    <div
      className={`py-1 border-b text-sm ${
        cancelled ? "text-red-500 line-through" : ""
      }`}
    >
      <div className="f-btw ">
        <div>{desc}</div>
      </div>

      {options.length !== 0 && (
        <div>
          {options.map((option) => (
            <div key={option.id} className="f-btw text-sm">
              <div>{`- ${option.qty} of ${option.name}`}</div>
              <div>{`$${new Decimal(option.value)
                .mul(option.qty)
                .toFixed(2)}`}</div>
            </div>
          ))}
        </div>
      )}

      <div className="f-btw">
        <div>{`${qty} X $${price.toFixed(2)}`}</div>
        <div>{`$${total.toFixed(2)}`}</div>
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
    <div className="py-1 border-b f-btw">
      <div className="">{label}</div>
      <div className={`${accent}`}>{`${negative ? "-" : ""}$${value.toFixed(
        2
      )}`}</div>
    </div>
  );
}

function LogLine({ log }: { log: string }) {
  if (log.length === 0) {
    return null;
  }

  const [when, who, what] = log.split("%%%");

  return (
    <div className="py-2 border-b text-sm">
      <div>{when}</div>
      <div>{who}</div>
      <div>{what}</div>
    </div>
  );
}
