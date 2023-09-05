import { BuffetDataType } from "@/components/BuffetPPForm";
import { SaleLineType } from "@/types/Sale";
import { BuffetClass, Sale } from "@/types/model";
import Decimal from "decimal.js";
import moment, { MomentInput } from "moment-timezone";

export const isMobile = (val: string | number) => {
  const input = val + "";
  const isValid =
    input.startsWith("4") ||
    input.startsWith("04") ||
    input.startsWith("+614") ||
    input.startsWith("614");

  const replaced = input.replace("+61", "");

  if (
    !isValid ||
    input.length < 9 ||
    isNaN(Number(replaced)) ||
    Number(replaced) > 500000000
  ) {
    return false;
  }

  return true;
};

export const convertIP = (val: string) => {
  return val
    .split("")
    .filter((char) => {
      return !isNaN(Number(char)) || char === ".";
    })
    .join("");
};

export const time = (input: MomentInput) =>
  moment(input).tz("Australia/Sydney");

export const buffetSummary = (
  buffetData: BuffetDataType,
  buffet: BuffetClass | undefined
) => {
  const { id, ppA, ppB, ppC } = buffetData;

  if (!id || buffet?.id !== id) {
    return {
      total: 0,
      pp: 0,
    };
  }

  const { priceA, priceB, priceC } = buffet;

  const A = new Decimal(ppA).mul(priceA);
  const B = new Decimal(ppB).mul(priceB);
  const C = new Decimal(ppC).mul(priceC);
  return {
    total: A.plus(B).plus(C).toNumber(),
    pp: new Decimal(ppA).plus(ppB).plus(ppC).toNumber(),
  };
};

export function howOld(started: Date) {
  const ms = new Date().getTime() - new Date(started).getTime();
  const ss = ms / 1000;
  const mn = ss / 60;
  const rem = Math.ceil(mn);

  return rem;
}

export type PhaseType = "order" | "stay" | "over";
export function buffetTimerMsg(
  phase: PhaseType,
  orderR: number,
  stayR: number
) {
  let pos = ``;
  let kiosk = ``;

  switch (phase) {
    case "order":
      pos = `Can order for ${orderR}mins`;
      kiosk = `You still have ${orderR}mins left to place your order`;
      break;
    case "stay":
      pos = `Can stay for ${stayR}mins`;
      kiosk = `Order time has ended, but you can still enjoy the buffet for ${stayR}mins more`;
      break;
    case "over":
      pos = `Occupied for ${stayR * -1}mins`;
      kiosk = `Your allocated stay time has ended (${
        stayR * -1
      }mins). We kindly request you to kindly give up the table. Thank you for your understanding`;
      break;
    default:
      pos = ``;
      kiosk = ``;
  }

  return { pos, kiosk };
}

export function SaleLineTotal(line: SaleLineType) {
  const { options, price, qty, discount } = line;
  let origin = new Decimal(price).mul(qty);
  let optionPrice = new Decimal(0);
  options.forEach((opt) => {
    const { value: oPrice, qty: oQty } = opt;
    const optPrice = new Decimal(oPrice).mul(oQty);
    optionPrice = optionPrice.plus(optPrice);
  });

  const unitPrice = optionPrice.plus(price);
  const subTotal = origin.plus(optionPrice);
  const total = subTotal.minus(discount);

  return {
    unitPrice: unitPrice.toNumber(),
    subTotal: subTotal.toNumber(),
    total: total.toNumber(),
  };
}

export const buffetReceiptLine = (
  sale: Sale,
  buffet: BuffetClass | undefined
) => {
  if (!buffet) {
    return [];
  }

  console.log("tock");
  const { ppA, ppB, ppC } = sale;
  const { name, priceA, priceB, priceC, nameA, nameB, nameC, id } = buffet;

  const lines: SaleLineType[] = [];

  if (ppA) {
    const line: SaleLineType = {
      id: new Date().getTime(),
      description: `${name}(${nameA})`,
      price: priceA,
      qty: ppA,
      discount: 0,
      total: new Decimal(priceA).mul(ppA).toNumber(),
      staff: "",
      note: "",
      productId: 99999,
      cancelled: false,
      options: [],
      printerIds: [],
    };
    lines.push(line);
  }

  if (ppB) {
    const line: SaleLineType = {
      id: new Date().getTime(),
      description: `${name}(${nameB})`,
      price: priceB,
      qty: ppB,
      discount: 0,
      total: new Decimal(priceB).mul(ppB).toNumber(),
      staff: "",
      note: "",
      productId: 99999,
      cancelled: false,
      options: [],
      printerIds: [],
    };
    lines.push(line);
  }

  if (ppC) {
    const line: SaleLineType = {
      id: new Date().getTime(),
      description: `${name}(${nameC})`,
      price: priceC,
      qty: ppC,
      discount: 0,
      total: new Decimal(priceC).mul(ppC).toNumber(),
      staff: "",
      note: "",
      productId: 99999,
      cancelled: false,
      options: [],
      printerIds: [],
    };
    lines.push(line);
  }

  return lines;
};

export const reloadPage = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.location.reload();
};
