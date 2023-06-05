import express from "express";
const jwt = require("jsonwebtoken");
import client from "@libs/prismaClient";
import moment from "moment-timezone";

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
