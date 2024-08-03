import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Device, Printer, Sale, Staff, Table } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Catalogue } from "../../type/combination";
import { filterCatalogue } from "@libs/saleData";
import { SaleLineType } from "../../type/Sale";
import { getPrinters, time } from "@libs/util";
import { OrderTicketType, ReceiptTicketType } from "../../type/Ticket";
import {
  printKickDrawer,
  printOrderTicket,
  printReceipt,
} from "@libs/printerDriver";
import { io } from "@libs/websocket";
import { syncReceipt } from "@libs/initDB";

async function getSaleAndStaff(saleId: string, staffId: number) {
  const sale = await client.sale.findFirst({
    where: {
      id: saleId,
      closedAt: null,
    },
    include: {
      _count: {
        select: {
          lines: true,
        },
      },
    },
  });

  const staff = await client.staff.findFirst({
    where: {
      id: staffId,
      archived: false,
    },
  });

  return { sale, staff };
}

type FormDataProps = {
  id?: number;
  name: string;
  type: string;
  archived: boolean;
  tableId?: number;
  ip: string;
};

export type BuffetDataType = {
  id?: number;
  ppA: number;
  ppB: number;
  ppC: number;
};

type OpenTableDataProps = {
  staffId: number;
  tableId: number;
  buffetData: BuffetDataType;
  pp: number;
};

export const updateDevice = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isStaff")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const { name, type, archived, tableId, ip }: FormDataProps = req.body;

    await client.device.upsert({
      where: {
        id,
      },
      update: {
        name,
        type: type.toUpperCase(),
        archived,
        tableId: tableId ? tableId : null,
        ip,
      },
      create: {
        name,
        type: type.toUpperCase(),
        tableId: tableId ? tableId : null,
        ip,
      },
    });

    return res.json({ ok: true });
  } catch (e: PrismaClientKnownRequestError | any) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Device" });
  }
};

export const getDevice = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  const result = await client.device.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Device Not Found!" });
  }

  return res.json({ ok: true, result });
};

export const getDevices = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<Device>>
) => {
  const { page = 1, keyword = "", offset = 20 } = req.query;

  const searchKeywords = keyword.split(" ").filter(Boolean);

  const where: any = {
    AND: [
      {
        OR: searchKeywords.map((keyword) => ({
          name: {
            contains: keyword + "",
            mode: "insensitive",
          },
        })),
      },
      {
        archived: false,
      },
    ],
  };

  const totalCount = await client.device.count({
    where: where,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const devices = await client.device.findMany({
    where: where,
    skip: (currentPage - 1) * offset,
    take: offset,
  });

  const result = await Promise.all(
    devices.map(async (dv) => {
      let table = null;
      if (dv.tableId) {
        table = await client.table.findUnique({
          where: {
            id: dv.tableId,
          },
          select: {
            id: true,
            name: true,
            container: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }

      return {
        ...dv,
        table,
      };
    })
  );

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return res.json({
    ok: true,
    result,
    hasPrev,
    hasNext,
    totalPages,
    pageSize: offset,
  });
};

export const deviceMe = async (req: Request, res: Response) => {
  return res.json({ ok: true, result: res.locals.device });
};

export const getTableData = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const device: Device = res.locals.device;

  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  let table: Table | null = null;

  if (device.type === "POS") {
    table = await client.table.findFirst({
      where: {
        id,
        archived: false,
      },
    });
  }

  if (device.type === "TABLE" && device.tableId) {
    table = await client.table.findFirst({
      where: {
        id: device.tableId,
        archived: false,
      },
    });
  }

  if (!table) {
    return res.status(404).json({ ok: false, msg: "Table Not Found" });
  }

  let sale: null | Sale = null;

  if (shift) {
    sale = await client.sale.findFirst({
      where: {
        shiftId: shift.id,
        closedAt: null,
        tableId: table.id,
      },
      include: {
        lines: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  let catalogue: Catalogue[] = [];

  if (sale && shift) {
    catalogue = await client.category.findMany({
      where: {
        archived: false,
        hoc: device.type === "POS" ? {} : false,
      },
      include: {
        products: {
          where: {
            hideKiosk: device.type === "POS" ? {} : false,
            archived: false,
            closeWithKitchen: shift.kitchenClosed ? false : undefined,
          },
          orderBy: {
            index: "asc",
          },
        },
      },
      orderBy: {
        index: "asc",
      },
    });

    catalogue = filterCatalogue(catalogue, sale.buffetId);
  }

  let buffets = await client.buffetClass.findMany({
    where: {
      archived: false,
    },
  });

  if (shift && shift.holiday) {
    buffets = buffets.map((bf) => ({
      ...bf,
      priceA: bf.h_priceA,
      priceB: bf.h_priceB,
      priceC: bf.h_priceC,
    }));
  }

  return res.json({ ok: true, table, sale, catalogue, buffets });
};

export const openTable = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;

  const {
    staffId,
    tableId,
    buffetData: { id: buffetId, ppA, ppB, ppC },
    pp,
  }: OpenTableDataProps = req.body;

  const staff = await client.staff.findFirst({
    where: {
      id: staffId,
      archived: false,
    },
  });

  if (!staff) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  if (!shift) {
    return res.status(404).json({ ok: false, msg: "Shop is closed!" });
  }

  const table = await client.table.findFirst({
    where: {
      id: tableId,
      archived: false,
    },
  });

  if (!table || (table && table.id !== id)) {
    return res.status(404).json({ ok: false, msg: "Table Not Found" });
  }

  const exist = await client.sale.count({
    where: {
      shiftId: shift.id,
      tableId: table.id,
      closedAt: null,
    },
  });

  if (exist !== 0) {
    return res.status(400).json({ ok: false, msg: "Already Opened!" });
  }

  const result = await client.sale.create({
    data: {
      shiftId: shift.id,
      tableId: table.id,
      tableName: table.name,
      openStaffId: staff.id,
      openStaff: `${staff.name}(${staff.id})`,
      ppA,
      ppB,
      ppC,
      pp,
      buffetId,
      buffetStarted: buffetId ? new Date() : null,
    },
  });

  io.emit(`table_${table.id}`);

  return res.json({ ok: true, result });
};

type UpdateBuffetDataType = {
  id: string;
  buffetId: number;
  ppA: number;
  ppB: number;
  ppC: number;
  pp: number;
  staffId: number;
  log: string;
};

export const updateBuffetData = async (req: Request, res: Response) => {
  const {
    id,
    buffetId,
    ppA,
    ppB,
    ppC,
    pp,
    staffId,
    log,
  }: UpdateBuffetDataType = req.body;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!staff) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found" });
  }

  try {
    const target = await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        buffetId,
        ppA,
        ppB,
        ppC,
        pp,
        buffetStarted: sale.buffetStarted ? sale.buffetStarted : new Date(),
        logs: sale.logs + log,
      },
    });

    io.emit(`table_${target.tableId}`);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Buffet Data!" });
  }
};

type UpdateBuffetTimeProps = {
  id: string;
  staffId: number;
  amount: number;
  log: string;
};

export const updateBuffetTime = async (req: Request, res: Response) => {
  const { id, staffId, amount, log }: UpdateBuffetTimeProps = req.body;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!staff) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found" });
  }

  try {
    if (!sale.buffetStarted) {
      return res.status(400).json({ ok: false, msg: "Inivalid Request!" });
    }

    const before = new Date(sale.buffetStarted).getTime();
    const amountM = Math.ceil(amount * 1000 * 60);
    const newVal = before + amountM;

    const target = await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        buffetStarted: new Date(newVal),
        logs: sale.logs + log,
      },
    });
    io.emit(`table_${target.tableId}`);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Buffet Data!" });
  }
};

type PlaceOrderDataType = {
  staffId: number;
  lines: SaleLineType[];
};

export const placeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { staffId, lines }: PlaceOrderDataType = req.body;
  const device: Device = res.locals.device;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  const isTable = device.type === "TABLE";

  if (!device) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!isTable && !staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  let buffetPrefix = `[A]`;

  if (sale.buffetId) {
    const buffet = await client.buffetClass.findUnique({
      where: {
        id: sale.buffetId,
      },
      select: {
        name: true,
      },
    });

    if (buffet) {
      buffetPrefix = `[${buffet.name[0].toUpperCase()}]`;
    }
  }

  try {
    // New Sales
    await client.saleLine.createMany({
      data: lines.map((line) => {
        const {
          description: desc,
          productId,
          price,
          qty,
          discount,
          options,
          total,
        } = line;
        return {
          saleId: sale.id,
          staff: isTable
            ? `Customer/${device.name}`
            : `${staff?.name}(${staff?.id})`,
          productId,
          desc,
          price,
          qty,
          discount,
          options: JSON.stringify(options),
          total,
        };
      }),
    });

    io.emit(`table_${sale.tableId}_mutate`);

    // Printing
    let prs: number[] = [];
    lines.forEach((line) => {
      prs = [...prs, ...line.printerIds];
    });

    const printerIds: number[] = [];
    new Set(prs).forEach((id) => printerIds.push(id));
    let printers: OrderTicketType[] = (await getPrinters(printerIds)).map(
      (pr) => ({
        ...pr,
        lines: [],
        isNew: sale._count.lines === 0,
        who: staff ? staff.name : "Customer",
        tableName: sale.tableName,
        pp: sale.pp,
        prefix: buffetPrefix,
      })
    );

    try {
      printers = printers.map((printer) => {
        const printerline = lines.filter((line) =>
          Boolean(line.printerIds.find((lp) => lp === printer.id))
        );
        return { ...printer, lines: printerline };
      });

      printers.forEach((data) => {
        printOrderTicket(data);
      });
    } catch (e) {
      console.log(e);
      return res.json({ ok: true });
    }

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Place Order!" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const device: Device = res.locals.device;

  if (!device || (device && device.type !== "POS")) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const { id } = req.params;
  const {
    staffId,
    lineId,
    log,
  }: { staffId: number; lineId: number; log: string } = req.body;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  try {
    await client.saleLine.update({
      where: {
        id: lineId,
      },
      data: {
        cancelled: true,
      },
    });

    await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        logs: sale.logs + log,
      },
    });

    io.emit(`table_${sale.tableId}_mutate`);

    // Printing

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Cancel Order!" });
  }
};

export const moveTable = async (req: Request, res: Response) => {
  const device: Device = res.locals.device;

  if (!device || (device && device.type !== "POS")) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const { id } = req.params;
  const { staffId, tableId }: { staffId: number; tableId: number } = req.body;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  const table = await client.table.findFirst({
    where: {
      id: tableId,
      archived: false,
    },
  });

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  if (!table) {
    return res.status(404).json({ ok: false, msg: "Table Not Found!" });
  }

  const exist = await client.sale.findFirst({
    where: {
      shiftId: sale.shiftId,
      tableId: table.id,
      closedAt: null,
    },
  });

  if (exist) {
    return res.json({ ok: false, msg: "The table already exists!" });
  }

  try {
    await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        tableName: table.name,
        tableId: tableId,
      },
    });

    io.emit(`table_${table.id}`);
    io.emit(`table_${sale.tableId}`);

    // Printing

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Cancel Order!" });
  }
};

export const mergeTable = async (req: Request, res: Response) => {
  const device: Device = res.locals.device;

  if (!device || (device && device.type !== "POS")) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const { id } = req.params;
  const { staffId, tableId }: { staffId: number; tableId: number } = req.body;

  const { sale: from, staff } = await getSaleAndStaff(id, staffId);

  const table = await client.table.findFirst({
    where: {
      id: tableId,
      archived: false,
    },
  });

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!from) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  if (!table) {
    return res.status(404).json({ ok: false, msg: "Table Not Found!" });
  }

  const to = await client.sale.findFirst({
    where: {
      shiftId: from.shiftId,
      tableId: table.id,
      closedAt: null,
    },
  });

  if (!to) {
    return res.json({ ok: false, msg: "There's no table!" });
  }

  if (from.buffetId !== to.buffetId) {
    return res.json({ ok: false, msg: "Invalid Buffet Class!" });
  }

  try {
    const log = `${time(new Date()).format("YYMMDD HH:mm")}%%%${staff.name}(${
      staff.id
    })%%%[Merged Table${from.tableName}/(${from.id}) to Table${to.tableName}(${
      to.id
    })]\n`;

    // to
    await client.sale.update({
      where: {
        id: to.id,
      },
      data: {
        ppA: to.ppA + from.ppA,
        ppB: to.ppB + from.ppB,
        ppC: to.ppC + from.ppC,
        pp: to.pp + from.pp,
        logs: to.logs + log,
      },
    });
    // from
    await client.sale.update({
      where: {
        id: from.id,
      },
      data: {
        closeStaff: staff.name,
        closeStaffId: staff.id,
        closedAt: new Date(),
        ppA: 0,
        ppB: 0,
        ppC: 0,
        pp: 0,
        logs: from.logs + log,
      },
    });

    // from line
    await client.saleLine.updateMany({
      where: {
        saleId: from.id,
      },
      data: {
        saleId: to.id,
      },
    });

    io.emit(`table_${table.id}`);
    io.emit(`table_${from.tableId}`);
    io.emit(`table_${to.tableId}`);

    // Printing

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Cancel Order!" });
  }
};

type PaymentDataType = {
  subTotal: number;
  charged: number;
  discount: number;
  total: number;
  cash: number;
  credit: number;
  creditSurcharge: number;
  rest: number;
  change: number;
  creditPaid: number;
  cashPaid: number;
  customerProperty: string;
  staffId: number;
};

export const payment = async (req: Request, res: Response) => {
  const device: Device = res.locals.device;
  const shop = await client.shop.findFirst();
  // || (device && device.type !== "POS")
  if (!device || !shop) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const { id } = req.params;
  const {
    subTotal,
    charged,
    discount,
    total,
    cash,
    credit,
    creditSurcharge,
    change,
    creditPaid,
    cashPaid,
    customerProperty,
    staffId,
  }: PaymentDataType = req.body;

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  try {
    const paid = await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        subTotal,
        charged,
        discount,
        total,
        cash,
        credit,
        creditSurcharge,
        change,
        creditPaid,
        cashPaid,
        customerProperty,
        closedAt: new Date(),
        closeStaffId: staff.id,
        closeStaff: `${staff.name}(${staff.id})`,
      },
      include: {
        lines: true,
      },
    });

    io.emit(`table_${paid.tableId}`);

    const printer = await client.printer.findFirst({
      where: {
        archived: false,
        isMain: true,
        hasDrawer: true,
      },
    });

    // Printing
    if (printer) {
      const printData: ReceiptTicketType = {
        ...printer,
        sale: paid,
        shop,
        tableName: sale.tableName,
        staff: staff.name,
      };
      printReceipt(printData);
    }

    // Sync
    await syncReceipt(paid);

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Payment!" });
  }
};

export const getLastInvoice = async (req: Request, res: Response) => {
  const shop = await client.shop.findFirst();
  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  const printer = await client.printer.findFirst({
    where: {
      archived: false,
      isMain: true,
      hasDrawer: true,
    },
  });

  // Printing

  if (!shop || !shift || !printer) {
    return res.json({ ok: false, msg: "Invalid Request!" });
  }

  try {
    const sale = await client.sale.findFirst({
      where: {
        shiftId: shift.id,
        closedAt: {
          not: null,
        },
      },
      orderBy: {
        closedAt: "desc",
      },
      include: {
        lines: true,
      },
    });

    if (!sale) {
      return res.json({ ok: false, msg: "Receipt Not Found" });
    }

    const printData: ReceiptTicketType = {
      ...printer,
      sale,
      shop,
      tableName: sale.tableName,
      staff: "",
    };
    printReceipt(printData);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Receipt Not Found" });
  }
};

export const shopData = async (req: Request, res: Response) => {
  const result = await client.shop.findFirst();

  if (!result) {
    return res.status(404).json({ ok: false, msg: "Shop Not Found" });
  }

  return res.json({ ok: true, result });
};

export const getAllProducts = async (req: Request, res: Response) => {
  const result = await client.category.findMany({
    where: {
      archived: false,
    },
    include: {
      products: {
        where: {
          archived: false,
        },
        orderBy: {
          index: "asc",
        },
      },
    },
    orderBy: {
      index: "asc",
    },
  });

  return res.json({ ok: true, result });
};

export const toggleOOS = async (req: Request, res: Response) => {
  const id: number = +req.params.id || 0;

  const target = await client.product.findFirst({
    where: {
      id,
      archived: false,
    },
  });

  if (!target) {
    return res.json({ ok: false, msg: "Product Not Found" });
  }

  try {
    await client.product.update({
      where: {
        id: target.id,
      },
      data: {
        outOfStock: !target.outOfStock,
      },
    });

    io.emit(`mutate`);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Toggle Out of stock " });
  }
};

export const kickDrawer = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;
  const printer = await client.printer.findFirst({
    where: {
      archived: false,
      hasDrawer: true,
    },
  });

  if (!staff || !printer) {
    return res.json({ ok: false });
  }

  try {
    printKickDrawer(printer);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false });
  }
};

export const toggleKitchen = async (req: Request, res: Response) => {
  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  // Printing

  if (!shift) {
    return res.json({ ok: false, msg: "Invalid Request!" });
  }

  try {
    await client.shift.update({
      where: {
        id: shift.id,
      },
      data: {
        kitchenClosed: !shift.kitchenClosed,
      },
    });
    io.emit("refresh");
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Receipt Not Found" });
  }
};

export const voidTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { staffId, lines }: PlaceOrderDataType = req.body;
  const device: Device = res.locals.device;
  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!device || !staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
  }

  try {
    console.log("req");
    // New Sales
    const count = await client.saleLine.count({
      where: {
        saleId: sale.id,
      },
    });
    console.log(count);

    if (count !== 0) {
      return res.json({ ok: false, msg: "This table can not be voided!" });
    }

    const voided = await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        closeStaff: `${staff.name}(${staff.id})`,
        closedAt: new Date(),
        logs: `${staff.name}(${staff.id}) voided`,
        pp: 0,
        ppA: 0,
        ppB: 0,
        ppC: 0,
        buffetId: null,
      },
    });

    console.log(voided);

    io.emit(`table_${sale.tableId}_mutate`);

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Place Order!" });
  }
};
