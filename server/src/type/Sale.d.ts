import { Sale, SaleLine } from "@prisma/client";

export type SaleLineType = {
  id: number;
  productId: number;
  cancelled: boolean;
  description: string;
  options: SelectedOptionType[];
  price: number;
  qty: number;
  discount: number;
  total: number;
  staff?: string;
  note: string;
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

export type SaleWithLines = Sale & {
  lines: SaleLine[];
};
