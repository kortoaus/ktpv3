import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Staff } from "@prisma/client";
import getRole from "@libs/getRole";

type BuffetClassDataProps = {
  id?: number;
  mId?: number | null;
  name: string;
  priceA: number;
  priceB: number;
  priceC: number;
  h_priceA: number;
  h_priceB: number;
  h_priceC: number;
  nameA: string;
  nameB: string;
  nameC: string;
  stayTime: number;
  orderTime: number;
  archived: boolean;
};

export const updateBuffetClass = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isBuffet")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const {
      name,
      priceA,
      priceB,
      priceC,
      h_priceA,
      h_priceB,
      h_priceC,
      nameA,
      nameB,
      nameC,
      stayTime,
      orderTime,
      archived,
    }: BuffetClassDataProps = req.body;

    await client.buffetClass.update({
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

export const getBuffetClasses = async (req: Request, res: Response) => {
  const result = await client.buffetClass.findMany({
    orderBy: {
      priceA: "asc",
    },
  });

  return res.json({
    ok: true,
    result: result.map((result) => ({
      ...result,
      productCount: result,
    })),
  });
};

export const getBuffetClass = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isBuffet")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.buffetClass.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Buffet Class Not Found!" });
  }

  return res.json({ ok: true, result });
};
