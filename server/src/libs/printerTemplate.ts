import { Printer } from "@prisma/client";
import { EscPos } from "@tillpos/xml-escpos-helper";
import { time } from "./util";
import {
  OrderTicketType,
  ReceiptTicketType,
  ShiftTicketType,
} from "../type/Ticket";
import {
  genDashLine,
  genTicketLine,
  genReceiptHeader,
  genReceiptLine,
  genPaymentData,
  genQR,
  genTextLine,
  genPaymentLine,
} from "@libs/printerGen";
import Decimal from "decimal.js";

export const kickDrawerBuffer = () => {
  const doc = `<?xml version="1.0" encoding="UTF-8"?>
  <document>
  <open-cash-drawer />
  </document>`;

  const buffer = EscPos.getBufferFromTemplate(doc, {});

  return buffer;
};

export const OrderTicketBuffer = async (data: OrderTicketType) => {
  const { isNew, pp, tableName, label, lines, isSplit, who: staff } = data;
  const now = time(new Date()).format("hh:mm");
  const docHeader = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
  <line-feed />

  <bold>
    <align mode="center">
      <text-line size="1:1">${isNew ? "[New]" : "[Add]"} / ${pp}pp</text-line>
    </align>
    <align mode="left">
      <text-line size="1:1">Table. ${tableName} / ${label}</text-line>
    </align>
  </bold>

  ${genDashLine()}
  `;

  let docBody = ``;

  // Item List
  const lineData = await Promise.all(
    lines.map(async (ln) => {
      const { description, qty, options } = ln;

      const optionStrings = options.map((opt) => `${opt.qty} of ${opt.name}`);

      let ld = ``;
      if (isSplit) {
        const arr = Array(qty).fill(0);
        const lines = await Promise.all(
          arr.map(async (arr) => {
            const ldd = await genTicketLine(description, 1, optionStrings);
            return ldd;
          })
        );
        ld = lines.join("");
      } else {
        ld = (await genTicketLine(description, qty, optionStrings)) + "";
      }
      return ld;
    })
  );

  docBody += lineData.join("");
  docBody += genDashLine();

  const docFooter = `
  <align mode="right">
  <text-line size="0:0">Staff. ${staff} / ${now}</text-line>
  </align>
  <paper-cut />
  </document>`;
  const doc = `${docHeader}${docBody}${docFooter}`;

  const buffer = EscPos.getBufferFromTemplate(doc, {});

  return buffer;
};

export const ReceiptBuffer = async (
  data: ReceiptTicketType,
  useDrawer = true
) => {
  const { shop, sale, tableName } = data;
  const { lines, closedAt, cashPaid } = sale;
  const { address1, address2, postcode, suburb, state, phone, abn } = shop;
  let address = `${address1} ${suburb} ${state} ${postcode}`;
  if (address2) {
    address = `${address2} ${address}`;
  }

  const docHeader = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>

  <align mode="center">
    <bold>
    <text-line size="2:1">${shop.name}</text-line>
    <line-feed />
    <text-line size="1:0">Tax Invoice</text-line>
    </bold>
    <line-feed />
    </align>

    <align mode="left">
    <text-line size="0:0">Tel: ${phone}</text-line>
    <text-line size="0:0">Address: ${address}</text-line>
    <text-line size="0:0">ABN: ${abn}</text-line>
    <text-line size="0:0">Table: #${tableName}</text-line>
    <text-line size="0:0">Issued At: ${time(closedAt).format(
      "Do MMM YY, h:mm a"
    )}</text-line>
    <text-line size="0:0">Printed At: ${time(new Date()).format(
      "Do MMM YY, h:mm a"
    )}</text-line>
    
    ${genDashLine()}
    ${await genReceiptHeader()}
    ${genDashLine()}
    </align>
  `;

  let docBody = ``;

  if (cashPaid && useDrawer) {
    docBody += `<open-cash-drawer />`;
  }

  // Item List
  const lineData = await Promise.all(
    lines
      .filter((ln) => !ln.cancelled)
      .map(async (ln) => {
        ln;

        if (ln.price === 0) {
          return "";
        }
        const ld = await genReceiptLine(ln);
        return ld;
      })
  );

  docBody += lineData.join("");
  docBody += genDashLine();

  // Payment Data
  docBody += await genPaymentData(sale);

  docBody += `<align mode="center">${await genQR(sale.id)}</align>`;

  const docFooter = `
  <paper-cut />
  </document>`;
  const doc = `${docHeader}${docBody}${docFooter}`;
  const buffer = EscPos.getBufferFromTemplate(doc, {});
  return buffer;
};

export const ShiftBuffer = async (data: ShiftTicketType) => {
  const { shift, shop } = data;
  const { address1, address2, postcode, suburb, state, name } = shop;
  let address = `${address1} ${suburb} ${state} ${postcode}`;
  if (address2) {
    address = `${address2} ${address}`;
  }

  const {
    subTotal,
    discount,
    charged,
    credit,
    creditSurcharge: surcharge,
    creditPaid: paidCredit,
    cashPaid: paidCash,
    openCash,
    closeCash,
    openStaff: openUserName,
    closeStaff: closeUserName,
    openAt,
    closedAt: closeAt,
    closeNote,
    openNote,
    total,
    differ,
    cashIn,
    cashOut,
    tables: saleCount,
  } = shift;

  const docHeader = `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>

  <align mode="center">
    <bold>
    <text-line size="2:1">${name}</text-line>
    <line-feed />
    <text-line size="1:0">Shift Closed</text-line>
    </bold>
    <line-feed />
    </align>
    ${genDashLine()}
  `;

  let docBody = ``;

  docBody += await genTextLine(`Opened By: ${openUserName}`);
  docBody += await genTextLine(
    `Opened At: ${time(openAt).format("Do, MMM, YYYY HH:mm / ddd")}`
  );
  docBody += await genTextLine(`Closed By: ${closeUserName}`);
  docBody += await genTextLine(
    `Closed At: ${time(closeAt).format("Do, MMM, YYYY HH:mm / ddd")}`
  );
  docBody += genDashLine();

  docBody += await genPaymentLine("Sub Total", subTotal);
  docBody += await genPaymentLine("Charged", charged);
  docBody += await genPaymentLine("Discount", discount);
  docBody += await genPaymentLine("Total", total);
  docBody += await genPaymentLine("Paid Credit", credit);
  docBody += await genPaymentLine("Paid Surcharge", surcharge);
  docBody += await genPaymentLine("Paid Total Credit", paidCredit);
  docBody += await genPaymentLine("Paid Cash", paidCash);
  docBody += await genPaymentLine(
    "Paid Total",
    +new Decimal(paidCash).plus(paidCredit).toNumber()
  );
  docBody += genDashLine();
  docBody += await genPaymentLine("Open Cash", openCash);
  docBody += await genPaymentLine("Paid Cash", paidCash);
  docBody += await genPaymentLine("Cash Out", cashOut);
  docBody += await genPaymentLine("Cash In", cashIn);
  docBody += await genPaymentLine(
    "Estimated Cash",
    new Decimal(openCash).plus(paidCash).minus(cashOut).plus(cashIn).toNumber()
  );
  docBody += await genPaymentLine("Close Cash", closeCash);
  docBody += await genPaymentLine("Difference", Math.abs(differ), differ < 0);
  docBody += genDashLine();

  // Note
  const openLines = openNote.match(/.{1,28}/g);
  if (openLines !== null) {
    const lineData = await Promise.all(
      openLines.map(async (ln) => {
        const ld = await genTextLine(ln);
        return ld;
      })
    );
    docBody += await genTextLine(`Open Note:`);
    docBody += lineData.join("");
    docBody += genDashLine();
  }

  const closeLines = closeNote.match(/.{1,28}/g);
  if (closeLines !== null) {
    const lineData = await Promise.all(
      closeLines.map(async (ln) => {
        const ld = await genTextLine(ln);
        return ld;
      })
    );
    docBody += await genTextLine(`Close Note:`);
    docBody += lineData.join("");
    docBody += genDashLine();
  }

  docBody += `<align mode="center">${await genQR(shift.id + "")}</align>`;

  const docFooter = `
  <paper-cut />
  </document>`;
  const doc = `${docHeader}${docBody}${docFooter}`;
  const buffer = EscPos.getBufferFromTemplate(doc, {});

  return buffer;
};
