import axios from "axios";
import fs from "fs";
import client from "@libs/prismaClient";
import { Printer } from "@prisma/client";
import moment, { MomentInput } from "moment-timezone";

export function readJsonFileSync(filepath: string, encoding: any) {
  if (typeof encoding == "undefined") {
    encoding = "utf8";
  }
  const file: string | Buffer = fs.readFileSync(filepath, encoding);
  return JSON.parse(file + "");
}

export async function downloadImage(url: string, filename: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  fs.writeFile(`images/${filename}.webp`, response.data, (err) => {
    if (err) throw err;
    console.log("Image downloaded successfully!");
  });
}

export const getPrinters = async (printerIds: number[]) => {
  const searched = await Promise.all(
    printerIds.map(async (pId) => {
      const printer = await client.printer.findFirst({
        where: { id: pId, archived: false },
      });
      return printer;
    })
  );

  const result: Printer[] = [];

  searched.forEach((sr) => {
    if (sr) {
      result.push(sr);
    }
  });

  return result;
};

export const time = (data: MomentInput) => moment(data).tz("Australia/Sydney");
