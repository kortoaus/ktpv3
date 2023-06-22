import { Sale } from "./model";

export type SaleWithTotal = Sale & {
  total: number;
};
