import { Sale, SaleLine } from "./model";

export type SaleWithTotal = Sale & {
  total: number;
};

export type SaleWithLines = Sale & {
  lines: SaleLine[];
};

export type SaleLineType = {
  id: number;
  cancelled: boolean;
  description: string;
  options: SelectedOptionType[];
  price: number;
  qty: number;
  discount: number;
  total: number;
  staff?: string;
  note: string;
  productId: number;
  printerIds: number[];
};

export type SelectedOptionType = {
  gId: number;
  oId: number;
  id: number;
  name: string;
  value: number;
  qty: number;
};

type customerPropertyType = "MS" | "FS" | "MY" | "FY" | "MM" | "FM";
