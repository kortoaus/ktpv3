import { Category } from "./model";

export type CategoryWithProductCount = Category & {
  productCount: number;
};
