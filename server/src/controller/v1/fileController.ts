import { Request, Response } from "express";
import client from "@libs/prismaClient";
import { Staff } from "@prisma/client";
import getRole from "@libs/getRole";

export const ImageUpload = async (req: Request, res: Response) => {
  if (req.file) {
    return res.json({ ok: true, id: req.file.filename });
  }

  return res.json({ ok: false, id: null });
};
