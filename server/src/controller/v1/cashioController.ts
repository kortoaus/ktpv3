import { Request, Response } from "express";
import client from "@libs/prismaClient";
import getRole from "@libs/getRole";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { printKickDrawer } from "@libs/printerDriver";

type FormDataProps = {
  staffId: number;
  cashIn: number;
  cashOut: number;
  note: string;
};

export const updateCashIO = async (req: Request, res: Response) => {
  const { cashIn, cashOut, staffId, note }: FormDataProps = req.body;

  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  if (!shift) {
    return res.status(404).json({ ok: false, msg: "Shop is closed!" });
  }

  const staff = await client.staff.findFirst({
    where: {
      id: staffId,
      archived: false,
    },
  });

  if (!staff) {
    return res.json({ ok: false, msg: "You do not have permission." });
  }

  if (!getRole(staff.permission, "isStaff")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    await client.cashIO.create({
      data: {
        shiftId: shift.id,
        staff: staff.name,
        staffId: staff.id,
        note,
        cashIn,
        cashOut,
      },
    });

    const printer = await client.printer.findFirst({
      where: {
        archived: false,
        hasDrawer: true,
      },
    });

    if (printer) {
      printKickDrawer(printer);
    }

    return res.json({ ok: true });
  } catch (e: PrismaClientKnownRequestError | any) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Update Cash Io" });
  }
};
