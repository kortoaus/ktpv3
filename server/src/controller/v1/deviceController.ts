import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Device, Sale, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Catalogue } from "../../type/combination";
import { filterCatalogue } from "@libs/saleData";

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
        },
      },
      orderBy: {
        index: "asc",
      },
    });
    catalogue = filterCatalogue(catalogue, sale.buffetId);
  }

  const buffets = await client.buffetClass.findMany({
    where: {
      archived: false,
    },
  });

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

  const staff = await client.staff.findFirst({
    where: {
      id: staffId,
      archived: false,
    },
  });

  if (!staff) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission" });
  }

  const sale = await client.sale.findFirst({
    where: {
      id,
      closedAt: null,
    },
  });

  if (!sale) {
    return res.status(404).json({ ok: false, msg: "Sale Not Found" });
  }

  try {
    const updated = await client.sale.update({
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
