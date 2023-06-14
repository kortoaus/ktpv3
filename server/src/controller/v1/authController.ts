import { Request, Response } from "express";
import client from "@libs/prismaClient";
import jwt from "jsonwebtoken";
import { Staff } from "@prisma/client";

type SignInDataType = {
  phone: number;
  code: string;
};

export const signIn = async (req: Request, res: Response) => {
  const { phone, code }: SignInDataType = req.body;

  if (phone > 500000000) {
    return res.status(403).json({ ok: false, msg: "Not Registered!" });
  }

  const staff = await client.staff.findFirst({
    where: {
      phone,
      code,
      archived: false,
    },
  });

  if (!staff) {
    return res.status(403).json({ ok: false, msg: "Not Registered!" });
  }

  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string") {
    return res.status(500).json({ ok: false, msg: "Failed Hashing!" });
  }

  const token = jwt.sign(
    { _id: staff.id, _signed: new Date().getTime() },
    secret
  );

  return res.json({ ok: true, token });
};

export const me = async (req: Request, res: Response) => {
  const staff: Staff | undefined = res.locals.staff;

  if (!staff) {
    return res.json({ ok: false });
  }

  return res.json({ ok: true, staff: res.locals.staff });
};
