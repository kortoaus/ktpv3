import { Sale, SaleLine } from "@prisma/client";
import { createCanvas, registerFont } from "canvas";
import { join } from "path";
import Decimal from "decimal.js";
const bwipjs = require("bwip-js");
import { SelectedOptionType } from "../type/Sale";

const fontPath = join(__dirname, "fonts");
const fontName = "Noto Sans KR";

registerFont(fontPath + "/NotoSans-Regular.otf", {
  family: "Noto Sans KR",
  weight: "400",
});

registerFont(fontPath + "/NotoSans-Bold.otf", {
  family: "Noto Sans KR",
  weight: "900",
});

export const genDashLine = () => {
  return `<text-line size="0:0">------------------------------------------------</text-line>`;
};

export const genTextLine = async (line: string) => {
  const canvas = createCanvas(600, 40);
  const ctx = canvas.getContext("2d");

  ctx.font = `28px ${fontName}`;
  ctx.fillText(line, 0, 30);

  const pngData = canvas.toBuffer();
  const image = `data:image/png;base64,${Buffer.from(pngData)
    .toString("base64")
    .replaceAll("=", "")}`;

  return `<image density="d128">
    ${image}
  </image>`;
};

export const genQR = async (data: string) => {
  const bcd = await bwipjs
    .toBuffer({
      bcid: "qrcode", // Barcode type
      text: data, // Text to encode
      includetext: false, // Show human-readable text
      textxalign: "center", // Always good to set this
    })
    .then((png: any) => {
      const image = `data:image/png;base64,${Buffer.from(png)
        .toString("base64")
        .replaceAll("=", "")}`;

      return `<line-feed /><image density="d128">
        ${image}
      </image>`;
    })
    .catch((err: any) => {
      console.log(err);
      return "";
    });

  return bcd;
};

export const genBarcode128 = async (data: string) => {
  const bcd = await bwipjs
    .toBuffer({
      bcid: "code128", // Barcode type
      text: data, // Text to encode
      scale: 1.5, // 3x scaling factor
      height: 8, // Bar height, in millimeters
      includetext: false, // Show human-readable text
      textxalign: "center", // Always good to set this
    })
    .then((png: any) => {
      const image = `data:image/png;base64,${Buffer.from(png)
        .toString("base64")
        .replaceAll("=", "")}`;

      return `<line-feed /><image density="d128">
        ${image}
      </image>`;
    })
    .catch((err: any) => {
      console.log(err);
      return "";
    });

  return bcd;
};

export const genTicketLine = async (
  rawName: string,
  qty: number,
  options: string[]
) => {
  const offset = 40;
  const name: string[] | null = rawName.match(/.{1,22}/g);

  if (!name) {
    return;
  }

  const nameH = offset * name.length;
  const height = nameH + options.length * offset;

  const canvas = createCanvas(600, height + 10);
  const ctx = canvas.getContext("2d");

  ctx.font = `900 40px ${fontName}`;
  ctx.fillText(qty + "", 0, offset);

  name.forEach((nm, nIdx) => {
    ctx.fillText(`${nm}`, 60, (nIdx + 1) * offset);
  });

  options.forEach((opt, oIdx) => {
    ctx.fillText(`--- ` + opt, 0, nameH + (oIdx + 1) * offset);
  });

  const pngData = canvas.toBuffer();
  const image = `data:image/png;base64,${Buffer.from(pngData)
    .toString("base64")
    .replaceAll("=", "")}`;

  return `<image density="d128">
    ${image}
  </image>`;
};

export const genReceiptHeader = async () => {
  const canvas = createCanvas(600, 30);
  const ctx = canvas.getContext("2d");
  ctx.font = `26px ${fontName}`;
  ctx.fillText("Description", 0, 26);
  ctx.fillText("Qty", 300, 26);
  ctx.fillText("Price", 450, 26);
  const pngData = canvas.toBuffer();
  const image = `data:image/png;base64,${Buffer.from(pngData)
    .toString("base64")
    .replaceAll("=", "")}`;

  return `<image density="d128">
    ${image}
  </image>`;
};

export const genReceiptLine = async (data: SaleLine) => {
  const { options: rawOptions, discount, desc: name, price, qty, total } = data;

  const parsed: SelectedOptionType[] = JSON.parse(rawOptions);

  const options: string[] = parsed.map(
    (opt) => `${opt.qty} of ${opt.name}${opt.value ? `($${opt.value})` : ""}`
  );

  let height = 60;
  height += options.length * 30;
  if (discount !== 0) {
    height += 30;
  }

  const canvas = createCanvas(600, height + 10);
  const ctx = canvas.getContext("2d");

  ctx.font = `100 24px ${fontName}`;
  ctx.fillText(`${name}`, 0, 30);
  ctx.fillText(`$${price.toFixed(2)}/ea`, 0, 60);
  ctx.fillText(qty + "", 300, 60);
  ctx.fillText(`$${total.toFixed(2)}`, 450, 60);

  options.forEach((opt, idx) => {
    ctx.fillText("- " + opt, 0, 60 + (idx + 1) * 30);
  });

  if (discount !== 0) {
    ctx.fillText("@Discount", 0, height);
    ctx.fillText(`-$${discount.toFixed(2)}`, 442, height);
  }

  const pngData = canvas.toBuffer();
  const image = `data:image/png;base64,${Buffer.from(pngData)
    .toString("base64")
    .replaceAll("=", "")}`;

  return `<image density="d128">
    ${image}
  </image>`;
};

export const genPaymentLine = async (
  label: string,
  amount: number,
  minus: boolean = false
) => {
  const canvas = createCanvas(600, 40);
  const ctx = canvas.getContext("2d");

  ctx.font = `32px ${fontName}`;
  ctx.fillText(label, 0, 30);
  if (minus) {
    ctx.fillText(`-`, 420, 30);
  }
  ctx.fillText(`$${amount.toFixed(2)}`, 430, 30);

  const pngData = canvas.toBuffer();
  const image = `data:image/png;base64,${Buffer.from(pngData)
    .toString("base64")
    .replaceAll("=", "")}`;

  return `<image density="d128">
    ${image}
  </image>`;
};

export const genPaymentData = async (sale: Sale) => {
  const {
    subTotal,
    charged,
    cash,
    cashPaid: paidCash,
    credit,
    creditSurcharge,
    creditPaid: paidCredit,
    discount,
    total,
    change,
  } = sale;

  let data = ``;

  data += await genPaymentLine("Sub Total", subTotal);

  if (charged) {
    data += await genPaymentLine("Surcharge", charged, false);
  }
  if (discount) {
    data += await genPaymentLine("Discount", discount, true);
  }

  data += await genPaymentLine("Total", total);

  if (paidCash) {
    data += await genPaymentLine("Cash Paid", paidCash);
  }
  if (credit) {
    data += await genPaymentLine("Credit", credit);
  }
  if (creditSurcharge) {
    data += await genPaymentLine("Credit Surcharge", creditSurcharge);
  }
  if (paidCredit) {
    data += await genPaymentLine("Credit Paid", paidCredit);
  }

  data += await genPaymentLine(
    "Total Paid",
    new Decimal(paidCredit).plus(paidCash).toNumber()
  );

  if (change) {
    data += genDashLine();
    data += await genPaymentLine("Received Cash", cash);
    data += await genPaymentLine("Changes", change);
  }

  data += genDashLine();

  return data;
};
