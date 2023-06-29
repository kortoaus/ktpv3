import axios from "axios";
import fs from "fs";
const https = require("https");

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
