import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Staff } from "@prisma/client";
import getRole from "@libs/getRole";

type CategoryDataProps = {
  id?: number;
  name: string;
  index: number;
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
