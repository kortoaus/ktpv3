import { Sale, SaleLine } from "./model";

export type SaleWithLines = Sale & {
  lines: SaleLine[];
};
