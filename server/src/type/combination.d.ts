import { Category, Product } from "@prisma/client";

export type Catalogue = Category & {
  products: Product[];
};

type BuffetPrice = {
  [key: number]: number;
};
