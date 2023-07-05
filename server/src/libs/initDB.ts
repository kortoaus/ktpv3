import { BuffetClass, Category, Product, Shop } from "@prisma/client";
import client from "./prismaClient";
import axios from "axios";
import { downloadImage } from "./util";

const apiKey = process.env.API_KEY || "";

type MigrationDataType = {
  buffetClass: BuffetClass[];
  product: Product[];
  category: Category[];
};

const datacenter = `https://itzsan.com/api`;
// const datacenter = `http://localhost:3001/api`;

const syncDB = async () => {
  try {
    const shifts = await client.shift.findMany({
      where: {
        synced: false,
        closedAt: {
          not: null,
        },
        total: {
          gt: 0,
        },
      },
    });
    if (shifts.length !== 0) {
      const synced: { ok: boolean; msg?: string; ids?: number[] } = await axios
        .post(`${datacenter}/sync`, {
          shifts,
          apiKey: process.env.API_KEY,
        })
        .then((res) => res.data);

      if (synced.ok) {
        if (synced.ids) {
          synced.ids.forEach(async (id) => {
            await client.shift.update({
              where: {
                id,
              },
              data: {
                synced: true,
              },
            });
          });
        }
      }
      console.log(synced.msg || "Connected!");
    }
  } catch (e) {
    console.log(`Failed Synchronize!`);
  }
};

const initDB = async () => {
  try {
    const { buffetClass, product, category }: MigrationDataType = (
      await axios.get(`${datacenter}/migration`)
    ).data;

    // Buffets
    buffetClass.forEach(async (item) => {
      const { id, archived } = item;
      await client.buffetClass.upsert({
        where: {
          id,
        },
        create: {
          ...item,
        },
        update: {
          ...item,
          archived: archived ? true : undefined,
        },
      });
    });
    console.log(`Buffet Data is updated.`);
    // Category
    category.forEach(async (item) => {
      const { id, archived } = item;
      await client.category.upsert({
        where: {
          id,
        },
        create: {
          ...item,
        },
        update: {
          ...item,
          archived: archived ? true : undefined,
        },
      });
    });
    console.log(`Category Data is updated.`);
    // Product
    product.forEach(async (item) => {
      const { id, archived } = item;
      await client.product.upsert({
        where: {
          id,
        },
        create: {
          ...item,
          imgId: item.imgId ? `${item.imgId}.webp` : null,
        },
        update: {
          ...item,
          imgId: item.imgId ? `${item.imgId}.webp` : null,
          printerIds: undefined,
          outOfStock: undefined,
          archived: archived ? true : undefined,
        },
      });
    });
    console.log(`Product Data is updated.`);

    const imgIds: string[] = product
      .map((pd) => (pd.imgId ? pd.imgId : ""))
      .filter((img) => typeof img === "string" && img !== "");

    imgIds.forEach(async (img) => {
      await downloadImage(
        `https://imagedelivery.net/Cqklq-HapOBQqS6V9uKtyw/${img}/origin`,
        img
      );
    });
    console.log(`All Images Downloaded.`);
    console.log("All Data is updated.");
  } catch (e) {
    console.error(`Failed Update Database. Please Check Internet Connection. `);
  } finally {
    await syncDB();
  }
};

export default initDB;
