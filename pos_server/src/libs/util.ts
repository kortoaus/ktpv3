import { BuffetDataType } from "@/components/BuffetPPForm";
import { BuffetClass, Staff } from "@/types/model";
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
