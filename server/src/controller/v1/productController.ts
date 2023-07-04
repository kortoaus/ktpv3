import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Product, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";

type ProductFormData = {
  imgId: null | string;
  name: string;
  categoryId: number;
  isBuffet: boolean;
  buffetIds: string;
  printerIds: string;
  price: number;
  buffetPrice: string;
  options: string;
  hideKiosk: boolean;
  outOfStock: boolean;
  archived: boolean;
};

export const getProductOptions = async (req: Request, res: Response) => {
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

  const where = {
    archived: false,
  };

  const categories = await client.category.findMany({
    where,
    orderBy: {
      index: "asc",
    },
  });

  const buffets = await client.buffetClass.findMany({
    where,
    orderBy: {
      priceA: "asc",
    },
  });

  const printers = await client.printer.findMany({
    where,
    orderBy: {
      label: "asc",
    },
  });

  return res.json({
    ok: true,
    result: {
      categories,
      buffets,
      printers,
    },
  });
};

export const updateProduct = async (req: Request, res: Response) => {
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

  try {
    const { archived, outOfStock, printerIds }: ProductFormData = req.body;

    await client.product.update({
      where: {
        id,
      },
      data: {
        archived,
        outOfStock,
        printerIds,
      },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update PRoduct" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
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

  const result = await client.product.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Product Not Found!" });
  }

  return res.json({ ok: true, result });
};

export const getProducts = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<Product>>
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

  const totalCount = await client.product.count({
    where: where,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const result = await client.product.findMany({
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

export const getAllOos = async (req: Request, res: Response) => {
  try {
    let result = await client.product.findMany({
      where: {
        archived: false,
        outOfStock: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    result = result.map((re) => ({
      ...re,
      name: `${re.category?.name} / ${re.name}`,
    }));
    return res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Fetch OOS!" });
  }
};
