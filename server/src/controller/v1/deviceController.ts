import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Device, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

type FormDataProps = {
  id?: number;
  name: string;
  type: string;
  archived: boolean;
  tableId?: number;
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
    const { name, type, archived, tableId }: FormDataProps = req.body;

    await client.device.upsert({
      where: {
        id,
      },
      update: {
        name,
        type: type.toUpperCase(),
        archived,
        tableId: tableId ? tableId : null,
      },
      create: {
        name,
        type: type.toUpperCase(),
        tableId: tableId ? tableId : null,
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
