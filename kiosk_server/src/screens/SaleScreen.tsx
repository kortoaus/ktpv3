"use client";
import CatalogueComp from "@/components/Catalogue";
import ReceiptLineCard from "@/components/ReceiptLineCard";
import SaleScreenHeader from "@/components/parts/SaleScreenHeader";
import { mutation } from "@/libs/apiURL";
import useBuffetTimer from "@/libs/useBuffetTimer";
import { buffetReceiptLine, reloadPage } from "@/libs/util";
import { Catalogue } from "@/types/Product";
import { SaleLineType, SaleWithLines } from "@/types/Sale";
import { BuffetClass, Table } from "@/types/model";
import Decimal from "decimal.js";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  sale: SaleWithLines;
  table: Table;
  catalogue: Catalogue[];
  buffets: BuffetClass[];
};

export default function SaleScreen({ sale, table, catalogue, buffets }: Props) {
  const [newLines, setNewLines] = useState<SaleLineType[]>([]);
  const [placedLine, setPlacedLine] = useState<SaleLineType[]>([]);
  const [buffetLines, setBuffetLines] = useState<SaleLineType[]>([]);
  const buffet = buffets.find((bf) => bf.id === sale.buffetId);
  const buffetTimer = useBuffetTimer({ buffet, started: sale.buffetStarted });
  const receiptRef = useRef<HTMLDivElement>(null);

  const checkQTY = (addup: number = 0) => {
    const qty =
      newLines.filter((nl) => nl.price === 0).reduce((a, b) => a + b.qty, 0) +
      addup;

    if (qty > 5) {
      window.alert(
        `Please note that the maximum order limit is 5 items per order. Thank you for your understanding and cooperation.`
      );
      return false;
    }
    return true;
  };

  const addNewLineHandler = (newLine: SaleLineType) => {
    if (!checkQTY(newLine.price === 0 ? newLine.qty : 0)) {
      return;
    }
    if (newLine) {
      setNewLines((prev) => [newLine, ...prev]);
    }
  };

  const removeNewLineHandler = (id: number) => {
    setNewLines((prev) => {
      const newLines = prev.filter((pr) => pr.id !== id);
      return newLines;
    });
  };

  const receiptScrollTop = () => {
    if (receiptRef && receiptRef.current) {
      receiptRef.current.scrollTo({ top: 0 });
    }
  };

  const placeOrderHandler = async (redirect: boolean = true) => {
    if (!checkQTY()) {
      return;
    }
    const result = await mutation(`/api/sale/${sale.id}/place`, {
      staffId: 0,
      lines: redirect ? newLines : [...newLines, ...buffetLines],
    });

    reloadPage();
    return;
  };

  const getTotal = () => {
    const lines = [
      ...buffetLines,
      ...newLines,
      ...placedLine.filter((pl) => !pl.cancelled),
    ];

    let total = new Decimal(0);

    lines.forEach((li) => {
      total = total.plus(li.total);
    });

    return total.toNumber();
  };

  const receiptTotal = getTotal();

  useEffect(() => {
    if (sale) {
      const { lines } = sale;
      const converted: SaleLineType[] = lines.map((line) => {
        const {
          id,
          cancelled,
          desc,
          options: lineOptions,
          price,
          qty,
          discount,
          total,
          staff,
          note,
          productId,
        } = line;
        return {
          id: id,
          cancelled,
          description: desc,
          options: JSON.parse(lineOptions),
          price,
          qty,
          discount,
          total,
          staff,
          note,
          productId: productId,
          printerIds: [],
        };
      });
      setPlacedLine(converted);
    }
  }, [sale]);

  useEffect(() => {
    if (buffet && buffetLines.length === 0) {
      setBuffetLines(buffetReceiptLine(sale, buffet));
    }
  }, [sale, buffet, buffetLines]);

  return (
    <div className="SaleScreen">
      {/* Header */}
      <SaleScreenHeader
        buffet={buffet}
        tableName={table.name}
        buffetTimer={buffetTimer}
      />

      {/* Catalogue */}
      <div className="ContentContainer">
        {/* Catalogue */}
        <div className="CatalogeContainer">
          <CatalogueComp
            cat={catalogue}
            add={(val) => {
              addNewLineHandler(val);
              receiptScrollTop();
            }}
          />
        </div>

        {/* ReceiptLines */}
        <div className="ReceiptContainer">
          <div className="ReceiptLineContainer" ref={receiptRef}>
            <div className="ReceiptLineInnerContainer">
              {/* New */}
              <div className="text-blue-500">
                {newLines.map((line) => (
                  <ReceiptLineCard
                    line={line}
                    key={`new_${line.id}`}
                    remove={() => removeNewLineHandler(line.id)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* SubTotal */}
          <div className=" bg-blue-500 text-white w-full fccc">
            <button
              className="w-full h-full"
              onClick={() => {
                if (newLines.length === 0) {
                  reloadPage();
                } else {
                  placeOrderHandler();
                }
              }}
            >
              <div className="text-2xl font-medium">Place Order</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
