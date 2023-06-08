import { BuffetClass, Category } from "./model";

export type CategoryWithProductCount = Category & {
  productCount: number;
};

export type ProductOption = {
  categories: Category[];
  buffets: BuffetClass[];
};
