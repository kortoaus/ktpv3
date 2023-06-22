import { Staff } from "@/types/model";
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
