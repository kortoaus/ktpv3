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

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isCategory")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const { name, index, archived }: CategoryDataProps = req.body;

    await client.category.upsert({
      where: {
        id,
      },
      update: {
        name,
        index,
        archived,
      },
      create: { name, index },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Category" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;
  if (!getRole(staff.permission, "isCategory")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.category.findMany({
    where: {
      archived: false,
    },
    orderBy: {
      index: "asc",
    },
    include: {
      _count: {
        select: {
          Product: true,
        },
      },
    },
  });

  return res.json({
    ok: true,
    result: result.map((result) => ({
      ...result,
      productCount: result._count.Product,
    })),
  });
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isCategory")) {
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
