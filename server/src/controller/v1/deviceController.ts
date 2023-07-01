import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Device, Printer, Sale, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Catalogue } from "../../type/combination";
import { filterCatalogue } from "@libs/saleData";
import { SaleLineType } from "../../type/Sale";
import { getPrinters } from "@libs/util";
import { OrderTicketType, ReceiptTicketType } from "../../type/Ticket";
import {
  printKickDrawer,
  printOrderTicket,
  printReceipt,
} from "@libs/printerDriver";

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

  const table = await client.table.findFirst({
    where: {
      id,
      archived: false,
    },
  });

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

  if (sale) {
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
    await client.sale.update({
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

    await client.sale.update({
      where: {
        id: sale.id,
      },
      data: {
        buffetStarted: new Date(newVal),
        logs: sale.logs + log,
      },
    });
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

  const { sale, staff } = await getSaleAndStaff(id, staffId);

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found!" });
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
          staff: `${staff.name}(${staff.id})`,
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
        who: staff.name,
        tableName: sale.tableName,
        pp: sale.pp,
      })
    );

    printers = printers.map((printer) => {
      const printerline = lines.filter((line) =>
        Boolean(line.printerIds.find((lp) => lp === printer.id))
      );
      return { ...printer, lines: printerline };
    });

    printers.forEach((data) => {
      printOrderTicket(data);
    });

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

    // Printing

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Cancel Order!" });
  }
};

// 뷔페 가격은 고정
// 뷔페 가격 0 일 때 State로 관리
// 테이블 이동 필요
// 뷔페 남은 시간 순서대로 보여주는 화면
// 직원 호출 종류 => 티켓, hold 15sec

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

  if (!device || (device && device.type !== "POS") || !shop) {
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
