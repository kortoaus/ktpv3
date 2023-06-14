import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Category, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

type FormDataProps = {
  name: string;
  code: string;
  phone: number;
  permission: string;
  archived: boolean;
};

export const updateStaff = async (req: Request, res: Response) => {
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
    const { name, code, phone, permission, archived }: FormDataProps = req.body;

    const exist = await client.staff.findFirst({
      where: {
        code,
      },
    });

    if (id === 0 && exist) {
      return res
        .status(403)
        .json({ ok: false, msg: "The code already exists!" });
    }

    if (id !== 0 && exist && exist.id !== id) {
      return res
        .status(403)
        .json({ ok: false, msg: "The code already exists!" });
    }

    await client.staff.upsert({
      where: {
        id,
      },
      update: {
        name,
        code,
        phone,
        permission,
        archived,
      },
      create: {
        name,
        code,
        phone,
        permission,
      },
    });

    return res.json({ ok: true });
  } catch (e: PrismaClientKnownRequestError | any) {
    let msg = undefined;

    console.log(e);
    if (e.code === "P2002" && e.meta["target"].join("") === "phone") {
      msg = "The phone number already exists!";
    }

    return res.json({ ok: false, msg: msg || "Failed Update Staff" });
  }
};

export const getStaff = async (req: Request, res: Response) => {
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

  const result = await client.staff.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Staff Not Found!" });
  }

  return res.json({ ok: true, result });
};

export const getStaffs = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<Staff>>
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

  const totalCount = await client.staff.count({
    where: where,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const result = await client.staff.findMany({
    where: where,
    skip: (currentPage - 1) * offset,
    take: offset,
  });

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
