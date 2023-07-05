import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Category, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { io } from "@libs/websocket";

type CategoryDataProps = {
  id?: number;
  name: string;
  index: number;
  hoc: boolean;
  archived: boolean;
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  const socket = io;
  socket.emit("refresh");

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isProduct")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const { archived }: CategoryDataProps = req.body;

    await client.category.update({
      where: {
        id,
      },
      data: {
        archived,
      },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Category" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isProduct")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.category.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Category Not Found!" });
  }

  return res.json({ ok: true, result });
};

export const getCategories = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<Category>>
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
    ],
  };

  const totalCount = await client.category.count({
    where: where,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const result = await client.category.findMany({
    where: where,
    orderBy: {
      index: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    skip: (currentPage - 1) * offset,
    take: offset,
  });

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return res.json({
    ok: true,
    result: result.map((result) => ({
      ...result,
      productCount: result._count.products,
    })),
    hasPrev,
    hasNext,
    totalPages,
    pageSize: offset,
  });
};
