"use client";
import CatalogueComp from "@/components/Catalogue";
import ReceiptLineCard from "@/components/ReceiptLineCard";
import DeleteIcon from "@/components/icons/DeleteIcon";
import BillDrawer from "@/components/parts/BillDrawer";
import SaleScreenHeader from "@/components/parts/SaleScreenHeader";
import { mutation } from "@/libs/apiURL";
import useBuffetTimer from "@/libs/useBuffetTimer";
import { buffetReceiptLine, buffetTimerMsg, reloadPage } from "@/libs/util";
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
  const [isBill, setIsBill] = useState(false);
  const [newLines, setNewLines] = useState<SaleLineType[]>([]);
  const [placedLine, setPlacedLine] = useState<SaleLineType[]>([]);
  const [buffetLines, setBuffetLines] = useState<SaleLineType[]>([]);
  const buffet = buffets.find((bf) => bf.id === sale.buffetId);
  const buffetTimer = useBuffetTimer({ buffet, started: sale.buffetStarted });
  const receiptRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

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
    if (loading) {
      return;
    }
    if (!checkQTY()) {
      return;
    }
    setLoading(true);
    const result = await mutation(`/api/sale/${sale.id}/place`, {
      staffId: 0,
      lines: redirect ? newLines : [...newLines, ...buffetLines],
    });

    setLoading(false);
    reloadPage();
    return;
  };

  const getTotal = () => {
    const lines = [...buffetLines, ...placedLine.filter((pl) => !pl.cancelled)];

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
        openBill={() => setIsBill(true)}
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
              <div className="">
                {newLines.map((line) => (
                  <div className="grid grid-cols-5">
                    <div className="col-span-4 text-blue-500">
                      <ReceiptLineCard
                        line={line}
                        key={`new_${line.id}`}
                        remove={() => removeNewLineHandler(line.id)}
                      />
                    </div>
                    <button
                      onClick={() => removeNewLineHandler(line.id)}
                      className="border-b fccc bg-red-500 text-white"
                    >
                      <DeleteIcon size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Place */}
          <div className=" bg-blue-500 text-white w-full fccc">
            <button
              className="w-full h-full"
              onClick={() => {
                if (loading) {
                  return;
                }
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

      <BillDrawer
        open={isBill}
        onClose={() => setIsBill(false)}
        lines={[...buffetLines, ...placedLine]}
        total={receiptTotal}
      />

      {buffetTimer && buffetTimer.phase === "stay" && (
        <div className="h-screen w-full fccc fixed top-0 z-50 bg-blue-500  p-4">
          <div className="text-white text-2xl font-medium animate-bounce text-center">
            {
              buffetTimerMsg(
                buffetTimer.phase,
                buffetTimer.orderRem,
                buffetTimer.stayRem
              ).kiosk
            }
          </div>
        </div>
      )}

      {buffetTimer && buffetTimer.phase === "over" && (
        <div className="h-screen w-full fccc fixed top-0 z-50 bg-red-500 p-4">
          <div className="text-white text-2xl font-medium animate-bounce text-center">
            {
              buffetTimerMsg(
                buffetTimer.phase,
                buffetTimer.orderRem,
                buffetTimer.stayRem
              ).kiosk
            }
          </div>
        </div>
      )}
    </div>
  );
}
