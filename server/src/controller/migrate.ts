import { downloadImage, readJsonFileSync } from "@libs/util";
import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { chownSync } from "fs";

type BuffetClassDataType = {
  id: number;
  name: string;
  priceA: number;
  priceWA: number;
  priceB: number;
  priceWB: number;
  priceC: number;
  priceWC: number;
  nameA: string;
  nameB: string;
  nameC: string;
  archived: false;
};

type categoryDataType = {
  id: number;
  name: string;
  index: number;
};

type productDataType = {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  img: string | null | undefined;
  destinations: string;
  bClasses: string;
  buffetOnly: true;
  buffetPrice: string;
  index: number;
  cost: number;
};

export const migrate = async (req: Request, res: Response) => {
  const buffetClassPath = __dirname + "/data/" + `buffetClass.json`;
  const buffetClassData: BuffetClassDataType[] = readJsonFileSync(
    buffetClassPath,
    "utf8"
  );
  buffetClassData.forEach(async (buffetClass) => {
    const { id, priceA, priceB, priceC, nameA, nameB, nameC, name } =
      buffetClass;
    await client.buffetClass.upsert({
      where: {
        id: buffetClass.id,
      },
      create: {
        id,
        priceA,
        h_priceA: priceA,
        priceB,
        h_priceB: priceB,
        priceC,
        h_priceC: priceC,
        nameA,
        nameB,
        nameC,
        name,
        stayTime: 90,
        orderTime: 60,
      },
      update: {},
    });
  });

  const categoryPath = __dirname + "/data/" + `category.json`;
  const categoryData: categoryDataType[] = readJsonFileSync(
    categoryPath,
    "utf8"
  );

  categoryData.forEach(async (data) => {
    const { id, name, index } = data;
    await client.category.upsert({
      where: {
        id,
      },
      create: {
        id,
        name,
        index,
      },
      update: {
        name,
        index,
      },
    });
  });

  const productPath = __dirname + "/data/" + `product.json`;
  const productData: productDataType[] = readJsonFileSync(productPath, "utf8");

  productData.forEach(async (data) => {
    const {
      id,
      categoryId,
      name,
      price,
      cost,
      bClasses,
      buffetOnly,
      buffetPrice: bp,
      img,
      index,
      destinations,
    } = data;
    // '[{"id":8,"price":0},{"id":9,"price":0}]';
    const prices: { id: number; price: number }[] = JSON.parse(bp);

    const buffetPrice: { [key: number]: number } = {};

    prices.forEach((pr) => {
      buffetPrice[pr.id] = pr.price;
    });

    await client.product.upsert({
      where: {
        id,
      },
      create: {
        id,
        categoryId,
        name,
        price,
        imgId: img ? `${img}.webp` : "",
        cost,
        isBuffet: buffetOnly,
        buffetPrice: JSON.stringify(buffetPrice),
        printerIds: destinations,
        buffetIds: bClasses,
        options: "[]",
        index,
      },
      update: {
        categoryId,
        name,
        price,
        imgId: img ? `${img}.webp` : "",
        cost,
        isBuffet: buffetOnly,
        buffetPrice: JSON.stringify(buffetPrice),
        printerIds: destinations,
        buffetIds: bClasses,
        options: "[]",
        index,
      },
    });
  });

  // Download Image
  const imgIds: string[] = productData
    .map((pd) => (pd.img ? pd.img : ""))
    .filter((img) => typeof img === "string" && img !== "");

  imgIds.forEach(async (img) => {
    await downloadImage(
      `https://imagedelivery.net/Cqklq-HapOBQqS6V9uKtyw/${img}/origin`,
      img
    );
  });

  return res.json({ ok: true });
};
