import { BuffetClass, Category, Product, Sale, Shop } from "@prisma/client";
import client from "./prismaClient";
import axios from "axios";
import { downloadImage } from "./util";
import { generateReportData } from "@controller/v1/shiftController";
import { SaleWithLines } from "../type/Sale";

const apiKey = process.env.API_KEY || "";

type MigrationDataType = {
  buffetClass: BuffetClass[];
  product: Product[];
  category: Category[];
};

// const datacenter = `http://localhost:4040/api/v2`;
const datacenter = `https://dc.itzsan.com/api/v2`;

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

    const reports = await Promise.all(
      shifts.map(async (shift) => {
        const report = await generateReportData(shift.id);
        return report;
      })
    );

    if (shifts.length !== 0) {
      const synced: { ok: boolean; msg?: string; ids?: number[] } = await axios
        .post(`${datacenter}/sync`, {
          shifts,
          reports,
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

    const sales = await client.sale.findMany({
      where: {
        synced: false,
        closedAt: {
          not: null,
        },
        subTotal: {
          gt: 0,
        },
      },
      include: {
        lines: true,
      },
    });

    await Promise.all(
      sales.map(async (sale) => {
        return await syncReceipt(sale);
      })
    );
  } catch (e) {
    console.log(`Failed Synchronize!`);
  }
};

const initDB = async () => {
  try {
    const { buffetClass, product, category }: MigrationDataType = (
      await axios.post(`${datacenter}/sync/data`, {
        apiKey,
      })
    ).data;

    // Buffets
    const buffetSync = await Promise.all(
      buffetClass.map(async (item) => {
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

        return id;
      })
    );
    console.log(`${buffetSync.length} Buffet Data is updated.`);

    // Category
    const catSync = await Promise.all(
      category.map(async (item) => {
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

        return id;
      })
    );
    console.log(`${catSync.length} Category Data is updated.`);

    // Product
    const productSync = await Promise.all(
      product.map(async (item) => {
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
            archived: archived !== undefined ? archived : undefined,
          },
        });

        return id;
      })
    );
    console.log(`${productSync.length} Product Data is updated.`);

    const imgIds: string[] = product
      .map((pd) => (pd.imgId ? pd.imgId : ""))
      .filter((img) => typeof img === "string" && img !== "");

    const downloaded = await Promise.all(
      imgIds.map(async (img) => {
        return await downloadImage(
          `https://imagedelivery.net/Cqklq-HapOBQqS6V9uKtyw/${img}/origin`,
          img
        );
      })
    );

    console.log(`${downloaded.filter((d) => d).length} Images Downloaded!`);
  } catch (e) {
    console.error(`Failed Update Database. Please Check Internet Connection. `);
  } finally {
    await syncDB();
  }
};

export default initDB;

export const syncReceipt = async (data: SaleWithLines) => {
  const result: { ok: boolean } = await axios
    .post(`${datacenter}/sync/receipt`, {
      receipt: data,
      apiKey: process.env.API_KEY,
    })
    .then((res) => res.data);

  if (result.ok) {
    await client.sale.update({
      where: {
        id: data.id,
      },
      data: {
        synced: true,
      },
    });
  }

  return data.id;
};
