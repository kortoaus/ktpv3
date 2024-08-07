import express from "express";
const jwt = require("jsonwebtoken");
import client from "@libs/prismaClient";
import { Console } from "console";

export const authMid = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const key = req.headers.authorization;

  if (key === undefined) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const [_, jwt_token] = key?.split(" ");

  if (!jwt_token) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const claim = jwt.verify(jwt_token, process.env.JWT_SECRET || "");

  if (typeof claim === "undefined") {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }
  const { _id: id, _signed }: { _id: number; _signed: number } = claim;

  const seconds = new Date().getTime() - _signed;
  const min = 1000 * 60;
  const differ = seconds / min;
  const maxAge = 30;

  if (differ > maxAge) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const staff = await client.staff.findFirst({
    where: {
      id,
      archived: false,
    },
  });

  if (!staff) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  res.locals.staff = staff;

  next();
};

export const authDeviceMid = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const key = req.headers.authorization;

  if (key === undefined) {
    return res.json({ ok: false, msg: "Unauthorized!" });
  }

  const [_, ip] = key?.split(" ");

  console.log(ip);

  const device = await client.device.findFirst({
    where: {
      archived: false,
      ip,
    },
  });

  if (!device) {
    return res.status(403).json({ ok: false, msg: "Unauthorized!" });
  }

  res.locals.device = device;

  next();
};
