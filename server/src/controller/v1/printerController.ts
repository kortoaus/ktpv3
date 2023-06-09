import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Staff } from "@prisma/client";
import getRole from "@libs/getRole";

type PrinterDataProps = {
  id?: number;
  label: string;
  ip: string;
  port: number;
  hasDrawer: boolean;
  isSplit: boolean;
  isMain: boolean;
  archived: boolean;
};

export const updatePrinter = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isDirector")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const {
      label,
      ip,
      port,
      hasDrawer,
      isSplit,
      isMain,
      archived,
    }: PrinterDataProps = req.body;

    await client.printer.upsert({
      where: {
        id,
      },
      update: {
        label,
        ip,
        port,
        hasDrawer,
        isSplit,
        isMain,
        archived,
      },
      create: { label, ip, port, hasDrawer, isSplit, isMain },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Printer" });
  }
};

export const getPrinters = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;
  if (!getRole(staff.permission, "isDirector")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.printer.findMany({
    where: {
      archived: false,
    },
    orderBy: {
      label: "asc",
    },
  });

  return res.json({
    ok: true,
    result,
  });
};

export const getPrinter = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isDirector")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.printer.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Printer Not Found!" });
  }

  return res.json({ ok: true, result });
};
