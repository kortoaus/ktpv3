import { Printer, SaleLine, Shift, Shop } from "@prisma/client";
import { SaleLineType, SaleWithLines } from "./Sale";

export type OrderTicketType = Printer & {
  lines: SaleLineType[];
  isNew: boolean;
  who: string;
  tableName: string;
  pp: number;
};

export type ReceiptTicketType = Printer & {
  sale: SaleWithLines;
  shop: Shop;
  staff: string;
  tableName: string;
};

export type ShiftTicketType = Printer & {
  shop: Shop;
  shift: Shift;
};
