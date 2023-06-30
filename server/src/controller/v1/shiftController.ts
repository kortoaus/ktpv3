import getRole from "@libs/getRole";
import client from "@libs/prismaClient";
import saleData from "@libs/saleData";
import { Staff } from "@prisma/client";
import Decimal from "decimal.js";
import { Response, Request } from "express";

export type ShiftResultType = {
  ppA: number;
  ppB: number;
  ppC: number;
  pp: number;
  subTotal: number;
  charged: number;
  total: number;
  credit: number;
  creditSurcharge: number;
  creditPaid: number;
  cashPaid: number;
  discount: number;
  c_ms: number;
  c_fs: number;
  c_my: number;
  c_fy: number;
  c_mm: number;
  c_fm: number;
  tables: number;
};

type OpenFormData = {
  openCash: number;
  openNote: string;
  holiday: boolean;
  revive: number[];
};

type CloseFormData = ShiftResultType & {
  closeCash: number;
  closeNote: string;
  differ: number;
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

    const receipts = await client.sale.findMany({
      where: {
        shiftId: shift.id,
        closedAt: {
          not: null,
        },
      },
    });

    let shiftResult = {
      ppA: 0,
      ppB: 0,
      ppC: 0,
      pp: 0,
      subTotal: 0,
      charged: 0,
      total: 0,
      credit: 0,
      creditSurcharge: 0,
      creditPaid: 0,
      cashPaid: 0,
      discount: 0,
      c_ms: 0,
      c_fs: 0,
      c_my: 0,
      c_fy: 0,
      c_mm: 0,
      c_fm: 0,
      tables: receipts.length,
    };

    receipts.forEach((receipt) => {
      const {
        ppA,
        ppB,
        ppC,
        pp,
        subTotal,
        charged,
        total,
        credit,
        creditSurcharge,
        creditPaid,
        cashPaid,
        discount,
        customerProperty,
      } = receipt;

      shiftResult.ppA = new Decimal(shiftResult.ppA).plus(ppA).toNumber();
      shiftResult.ppB = new Decimal(shiftResult.ppB).plus(ppB).toNumber();
      shiftResult.ppC = new Decimal(shiftResult.ppC).plus(ppC).toNumber();
      shiftResult.pp = new Decimal(shiftResult.pp).plus(pp).toNumber();
      shiftResult.subTotal = new Decimal(shiftResult.subTotal)
        .plus(subTotal)
        .toNumber();
      shiftResult.charged = new Decimal(shiftResult.charged)
        .plus(charged)
        .toNumber();
      shiftResult.total = new Decimal(shiftResult.total).plus(total).toNumber();
      shiftResult.credit = new Decimal(shiftResult.credit)
        .plus(credit)
        .toNumber();
      shiftResult.creditSurcharge = new Decimal(shiftResult.creditSurcharge)
        .plus(creditSurcharge)
        .toNumber();
      shiftResult.creditPaid = new Decimal(shiftResult.creditPaid)
        .plus(creditPaid)
        .toNumber();
      shiftResult.cashPaid = new Decimal(shiftResult.cashPaid)
        .plus(cashPaid)
        .toNumber();
      shiftResult.discount = new Decimal(shiftResult.discount)
        .plus(discount)
        .toNumber();

      shiftResult.c_ms =
        shiftResult.c_ms + Number(customerProperty === "ms".toUpperCase());
      shiftResult.c_fs =
        shiftResult.c_fs + Number(customerProperty === "fs".toUpperCase());
      shiftResult.c_my =
        shiftResult.c_my + Number(customerProperty === "my".toUpperCase());
      shiftResult.c_fy =
        shiftResult.c_fy + Number(customerProperty === "fy".toUpperCase());
      shiftResult.c_mm =
        shiftResult.c_mm + Number(customerProperty === "mm".toUpperCase());
      shiftResult.c_fm =
        shiftResult.c_fm + Number(customerProperty === "fm".toUpperCase());
    });

    return res.json({ ok: true, shift, sales, shiftResult });
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
      closedAt: null,
    },
  });

  if (exist) {
    return res.status(403).json({ ok: false, msg: "Shop already opened!" });
  }

  try {
    const { openCash, openNote, holiday, revive }: OpenFormData = req.body;

    await client.shift.create({
      data: {
        openCash,
        openNote,
        openStaff: `${staff.name}(${staff.id})`,
        openStaffId: staff.id,
        holiday,
      },
    });

    revive.forEach(
      async (re) =>
        await client.product.update({
          where: { id: re },
          data: { outOfStock: false },
        })
    );

    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ ok: false, msg: "Failed Open Shop!" });
  }
};

export const closeShift = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;

  if (!getRole(staff.permission, "isOpen")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  if (!shift) {
    return res.status(403).json({ ok: false, msg: "Shop already closed!" });
  }

  try {
    const {
      ppA,
      ppB,
      ppC,
      pp,
      subTotal,
      charged,
      total,
      credit,
      creditSurcharge,
      creditPaid,
      cashPaid,
      discount,
      c_ms,
      c_fs,
      c_my,
      c_fy,
      c_mm,
      c_fm,
      tables,
      closeCash,
      closeNote,
      differ,
    }: CloseFormData = req.body;

    await client.shift.update({
      where: {
        id: shift.id,
      },
      data: {
        closedAt: new Date(),
        closeStaff: `${staff.name}(${staff.id})`,
        closeStaffId: staff.id,
        ppA,
        ppB,
        ppC,
        pp,
        subTotal,
        charged,
        total,
        credit,
        creditSurcharge,
        creditPaid,
        cashPaid,
        discount,
        c_ms,
        c_fs,
        c_my,
        c_fy,
        c_mm,
        c_fm,
        tables,
        closeCash,
        closeNote,
        differ,
      },
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(400).json({ ok: false, msg: "Failed Open Shop!" });
  }
};
