"use client";
import CatalogueComp from "@/components/Catalogue";
import ReceiptLineCard from "@/components/ReceiptLineCard";
import PaymentDrawer, {
  PaymentDataType,
} from "@/components/parts/PaymentDrawer";
import SaleBuffetTimeUpdateDrawer from "@/components/parts/SaleBuffetTimeUpdateDrawer";
import SaleBuffetDrawer from "@/components/parts/SaleBuffetUpdateDrawer";
import SaleScreenHeader from "@/components/parts/SaleScreenHeader";
import { mutation } from "@/libs/apiURL";
import useBuffetTimer from "@/libs/useBuffetTimer";
import { SaleLineTotal, buffetReceiptLine, time } from "@/libs/util";
import { Catalogue } from "@/types/Product";
import { SaleLineType, SaleWithLines } from "@/types/Sale";
import { ApiResultType } from "@/types/api";
import { BuffetClass, Staff, Table } from "@/types/model";
import Decimal from "decimal.js";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";

type Props = {
  sale: SaleWithLines;
  table: Table;
  staff: Staff;
  catalogue: Catalogue[];
  buffets: BuffetClass[];
};

export default function SaleScreen({
  sale,
  table,
  catalogue,
  buffets,
  staff,
}: Props) {
  const router = useRouter();
  const [openBuffetDrawer, setOpenBuffetDrawer] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [openBuffetTime, setOpenBuffetTime] = useState(false);
  const [newLines, setNewLines] = useState<SaleLineType[]>([]);
  const [placedLine, setPlacedLine] = useState<SaleLineType[]>([]);
  const [buffetLines, setBuffetLines] = useState<SaleLineType[]>([]);
  const buffet = buffets.find((bf) => bf.id === sale.buffetId);
  const buffetTimer = useBuffetTimer({ buffet, started: sale.buffetStarted });
  const receiptRef = useRef<HTMLDivElement>(null);

  const addNewLineHandler = (newLine: SaleLineType) => {
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

  const cancelOrderHandler = async (id: number) => {
    const line = placedLine.find((pl) => pl.id === id);

    if (!line) {
      return;
    }

    const msg = `Do you want to cancel [${line.qty} of ${line.description}]?`;

    if (!window.confirm(msg)) {
      return;
    }

    const log = `${time(new Date()).format("YYMMDD HH:mm")}%%%${staff.name}(${
      staff.id
    })%%%Cancel ${line.description}(${line.qty}) \n`;

    const result: ApiResultType = await mutation(
      `/api/sale/${sale.id}/cancel`,
      {
        staffId: staff.id,
        lineId: id,
        log,
      }
    );

    if (result && result.ok) {
      router.push("/");
      return;
    }

    if (result && !result.ok) {
      window.alert(result?.msg || "Failed!");
      return;
    }

    return;
  };

  const receiptScrollTop = () => {
    if (receiptRef && receiptRef.current) {
      receiptRef.current.scrollTo({ top: 0 });
    }
  };

  const placeOrderHandler = async (redirect: boolean = true) => {
    const result: ApiResultType = await mutation(`/api/sale/${sale.id}/place`, {
      staffId: staff.id,
      lines: redirect ? newLines : [...newLines, ...buffetLines],
    });

    if (result && result.ok) {
      if (redirect) {
        router.push("/");
      }
      return true;
    }

    if (result && !result.ok) {
      window.alert(result?.msg || "Failed!");
      return false;
    }

    return false;
  };

  const getTotal = () => {
    const lines = [
      ...buffetLines,
      ...newLines,
      ...placedLine.filter((pl) => !pl.cancelled),
    ];

    let total = new Decimal(0);

    lines.forEach((li) => {
      total = total.plus(SaleLineTotal(li).total);
    });

    return total.toNumber();
  };

  const receiptTotal = getTotal();

  const paymentHandler = async (data: PaymentDataType) => {
    if (newLines.length + buffetLines.length !== 0) {
      const result = await placeOrderHandler(false);
      if (!result) {
        return;
      }
    }

    const paymentData = {
      staffId: staff.id,
      ...data,
    };

    await mutation(`/api/sale/${sale.id}/payment`, paymentData)
      .then((data: ApiResultType) => {
        if (data.ok) {
          setOpenPay(false);
          if (paymentData.change) {
            window.alert(`Change: $${paymentData.change.toFixed(2)}`);
          }
          router.push("/");
        } else {
          window.alert(data.msg || "Failed Payment!");
          return;
        }
      })
      .finally(() => {
        setOpenPay(false);
        return;
      });
  };

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
        openBuffet={setOpenBuffetDrawer}
        openTimer={setOpenBuffetTime}
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
              {/* Buffet */}
              <div className="bg-purple-500 text-white">
                {buffetLines
                  .filter((bf) => bf.price !== 0)
                  .map((line, idx) => (
                    <ReceiptLineCard
                      line={line}
                      key={`${line.description}_${idx}`}
                      remove={() => setOpenBuffetDrawer(true)}
                    />
                  ))}
              </div>
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
              {/* Placed */}
              <div className="">
                {placedLine.map((line) => (
                  <ReceiptLineCard
                    line={line}
                    key={`placed_${line.id}`}
                    remove={() => cancelOrderHandler(line.id)}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* SubTotal */}
          <div className="h-16 bg-blue-500 text-white w-full fccc">
            <button
              className="w-full h-full"
              onClick={() => {
                if (newLines.length === 0) {
                  router.push("/");
                } else {
                  placeOrderHandler();
                }
              }}
            >
              <div className="text-2xl font-medium">Place Order</div>
            </button>
          </div>
          {/* Functions */}
          <div className="FunctionContainer ">
            <button onClick={() => setOpenPay(true)}>
              <div>Pay</div>
              <div>{receiptTotal.toFixed(2)}</div>
            </button>
            <button>b</button>
            <button>c</button>
            <button>d</button>
          </div>
        </div>
      </div>

      <SaleBuffetDrawer
        open={openBuffetDrawer}
        sale={sale}
        table={table}
        buffets={buffets}
        onClose={() => setOpenBuffetDrawer(false)}
        staff={staff}
      />

      {buffet && sale.buffetStarted && (
        <SaleBuffetTimeUpdateDrawer
          open={openBuffetTime}
          onClose={() => setOpenBuffetTime(false)}
          sale={sale}
          table={table}
          staff={staff}
        />
      )}

      <PaymentDrawer
        amount={receiptTotal}
        pay={(val) => paymentHandler(val)}
        open={openPay}
        onClose={() => setOpenPay(false)}
      />
    </div>
  );
}
