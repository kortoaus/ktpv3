import client from "@libs/prismaClient";
import { Response, Request } from "express";

export const getCurrentShift = async (req: Request, res: Response) => {
  const shift = await client.shift.findFirst({
    where: {
      closedAt: null,
    },
  });

  if (shift) {
    return res.json({ ok: true, shift });
  } else {
    return res.json({ ok: true, shift: null });
  }
};
