import { Shop } from "@prisma/client";
import client from "./prismaClient";

const apiKey = process.env.API_KEY || "";

const initDB = async () => {
  const shopData = {
    id: 1,
    abn: "12345",
    name: "ITZSAN YAKINIKU",
    phone: "ITZSAN YAKINIKU",
    logo: "",
    address1: "30 Joseph Street",
    address2: "",
    suburb: "Lidcombe",
    state: "NSW",
    postcode: "2141",
    apiKey,
  };

  await client.shop.upsert({
    where: {
      id: shopData.id,
    },
    update: { ...shopData },
    create: { ...shopData },
  });

  console.log("DB Initialized!");
};

export default initDB;
