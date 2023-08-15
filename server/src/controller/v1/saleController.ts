import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { CashIO, Sale } from "@prisma/client";
import { PaginationParams, PaginationResponse } from "../../type/pagination";
import { ReceiptTicketType } from "../../type/Ticket";
import { printReceipt } from "@libs/printerDriver";

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

  if (!result) {
    return res.json({ ok: false, msg: "Receipt Not Found!" });
  }

  return res.json({ ok: true, result });
};

export const printReceiptHandler = async (req: Request, res: Response) => {
  const { id } = req.params || 0;

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
        id,
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
    printReceipt(printData, false);
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Receipt Not Found" });
  }
};

export const getCashios = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PaginationResponse<CashIO>>
) => {
  const { page = 1, keyword = "", offset = 20 } = req.query;

  const totalCount = await client.cashIO.count({});

  const totalPages = totalCount ? Math.ceil(totalCount / offset) : 1;
  const currentPage = Math.min(
    Math.max(1, parseInt(page.toString())),
    totalPages
  );

  const result = await client.cashIO.findMany({
    skip: (currentPage - 1) * offset,
    take: offset,
    orderBy: {
      createdAt: "desc",
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
