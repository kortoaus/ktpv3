import { BuffetClass, Category, Printer } from "./model";

export type CategoryWithProductCount = Category & {
  productCount: number;
};

export type ProductOption = {
  categories: Category[];
  buffets: BuffetClass[];
  printers: Printer[];
};

export type ProductOptionValue = {
  id: number;
  name: string;
  value: number;
};

export type ProductOptionGroupMode = "radio" | "checkbox" | "count";

export type ProductOptionGroup = {
  mode: ProductOptionGroupMode;
  id: number;
  name: string;
  required: boolean;
  min: number;
  max: number;
  options: ProductOptionValue[];
};

export type SelectedOptionType = {
  gId: number;
  oId: number;
  id: number;
  name: string;
  value: number;
  qty: number;
};
