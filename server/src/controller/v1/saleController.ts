import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Category, Sale, SaleLine, Staff } from "@prisma/client";
import getRole from "@libs/getRole";
import { PaginationParams, PaginationResponse } from "../../type/pagination";

type SaleWithLines = Sale & {
  lines: SaleLine[];
};

export const getReceipts = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<Sale>>
) => {
  const { page = 1, keyword = "", offset = 20 } = req.query;

  const searchKeywords = keyword.split(" ").filter(Boolean);

  const where: any = {
    AND: [
      {
        OR: searchKeywords.map((keyword) => ({
          id: {
            contains: keyword + "",
            mode: "insensitive",
          },
        })),
      },
      {
        closedAt: {
          not: null,
        },
      },
    ],
  };

  const totalCount = await client.sale.count({
    where: where,
  });

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const result = await client.sale.findMany({
    where: where,
    skip: (currentPage - 1) * offset,
    take: offset,
    orderBy: {
      closedAt: "desc",
    },
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

export const getReceipt = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await client.sale.findFirst({
    where: {
      id,
      closedAt: {
        not: null,
      },
    },
    include: {
      lines: true,
    },
  });

  console.log(result);

  if (!result) {
    return res.json({ ok: false, msg: "Receipt Not Found!" });
  }

  return res.json({ ok: true, result });
};
