import { Sale } from "@prisma/client";
import client from "./prismaClient";
import Decimal from "decimal.js";

export default async function saleData(sale: Sale) {
  const { buffetId, ppA, ppB, ppC } = sale;
  let total = new Decimal(0);
  // Line Total
  const lines: { qty: number; price: number; discount: number }[] = [];

  lines.forEach((line) => {
    const { qty, price, discount } = line;
    const linePrice = new Decimal(qty).mul(price).minus(discount);
    if (linePrice.gt(0)) {
      total = total.plus(linePrice);
    }
  });

  // Buffet Total
  if (buffetId) {
    const buffet = await client.buffetClass.findUnique({
      where: {
        id: buffetId,
      },
    });

    if (buffet) {
      const { priceA, priceB, priceC } = buffet;
      const A = new Decimal(ppA).mul(priceA);
      const B = new Decimal(ppB).mul(priceB);
      const C = new Decimal(ppC).mul(priceC);
      total = total.plus(A).plus(B).plus(C);
    }
  }

  return { ...sale, total: total.toNumber() };
}
