import { Sale } from "@prisma/client";
import client from "./prismaClient";
import Decimal from "decimal.js";
import { BuffetPrice, Catalogue } from "../type/combination";

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

export function filterCatalogue(
  catalogues: Catalogue[],
  buffetId: number | null
) {
  const filtered: Catalogue[] = [];

  catalogues.forEach((cat) => {
    const now = { ...cat };

    let products = now.products;

    if (buffetId) {
      products = products.filter((pd) => {
        if (pd.isBuffet && buffetId) {
          const buffets: number[] = JSON.parse(pd.buffetIds);
          return buffets.findIndex((bfs) => bfs === buffetId) !== -1;
        } else {
          return true;
        }
      });

      products = products.map((pd) => {
        const { isBuffet, price, buffetPrice: rawBPs } = pd;
        const bps: BuffetPrice = JSON.parse(rawBPs);
        const bp = bps[buffetId] ? bps[buffetId] : 0;
        return { ...pd, price: isBuffet ? bp : price };
      });
    } else {
      products = products.filter((pd) => {
        return !pd.isBuffet;
      });
    }

    now.products = products;

    if (now.products.length > 0) {
      filtered.push(now);
    }
  });

  return filtered;
}
