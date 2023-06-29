import getRole from "@libs/getRole";
import client from "@libs/prismaClient";
import saleData from "@libs/saleData";
import { Staff } from "@prisma/client";
import { Response, Request } from "express";

type OpenFormData = {
  openCash: number;
  openNote: string;
  holiday: boolean;
};

export const getCurrentShift = async (req: Request, res: Response) => {
  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });
  if (shift) {
    const sl = await client.sale.findMany({
      where: {
        shiftId: shift.id,
        closedAt: null,
      },
      include: { lines: { where: { cancelled: false } } },
    });

    const sales = await Promise.all(
      sl.map(async (sale) => ({ ...(await saleData(sale, shift.holiday)) }))
    );

    return res.json({ ok: true, shift, sales });
  } else {
    return res.json({ ok: true, shift: null });
  }
};

export const openShift = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;

  if (!getRole(staff.permission, "isOpen")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const exist = await client.shift.count({
    where: {
      closedAt: {
        not: null,
      },
    },
  });

  if (exist) {
    return res.status(403).json({ ok: false, msg: "Shop already opened!" });
  }

  try {
    const { openCash, openNote, holiday }: OpenFormData = req.body;

    await client.shift.create({
      data: {
        openCash,
        openNote,
        openStaff: `${staff.name}(${staff.id})`,
        openStaffId: staff.id,
        holiday,
      },
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ ok: false, msg: "Failed Open Shop!" });
  }
};
