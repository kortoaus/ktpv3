import getRole from "@libs/getRole";
import client from "@libs/prismaClient";
import { Staff } from "@prisma/client";
import { Response, Request } from "express";

export const updateTableContainer = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;

  if (!getRole(staff.permission, "isTable")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const {
    id,
    name,
    archived,
    index,
  }: { id: number | null; name: string; archived: boolean; index: number } =
    req.body;

  await client.tableContainer.upsert({
    where: {
      id: id || 0,
    },
    update: {
      name,
      archived,
      index,
    },
    create: {
      name,
      index,
    },
  });

  return res.json({ ok: true });
};

export const getTableContainers = async (req: Request, res: Response) => {
  const staff: Staff = res.locals.staff;
  if (!getRole(staff.permission, "isTable")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.tableContainer.findMany({
    where: {
      archived: false,
    },
    orderBy: {
      index: "asc",
    },
  });

  return res.json({ ok: true, result });
};

export const getTableContainer = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isTable")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.tableContainer.findFirst({
    where: {
      id,
      archived: false,
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Container Not Found" });
  }

  return res.json({ ok: true, result });
};

export const getTableContainerWithTables = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isTable")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  const result = await client.tableContainer.findFirst({
    where: {
      id,
      archived: false,
    },
    include: {
      tables: {
        where: {
          archived: false,
        },
        select: {
          id: true,
          index: true,
          name: true,
        },
      },
    },
  });

  if (!result) {
    return res.json({ ok: false, msg: "Container Not Found" });
  }

  return res.json({ ok: true, result });
};

export const updateTable = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const tIdx = req.params.tIdx ? Math.abs(+req.params.tIdx) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id) || isNaN(tIdx)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  if (!getRole(staff.permission, "isTable")) {
    return res
      .status(403)
      .json({ ok: false, msg: "You do not have permission." });
  }

  try {
    const { name, archived }: { name: string; archived: boolean } = req.body;

    const exist = await client.table.findFirst({
      where: {
        containerId: id,
        index: tIdx,
      },
      select: {
        id: true,
      },
    });

    await client.table.upsert({
      where: {
        id: exist ? exist.id : 0,
      },
      create: {
        name,
        index: tIdx,
        container: {
          connect: {
            id,
          },
        },
      },
      update: {
        name,
        archived,
      },
    });
    return res.json({ ok: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ ok: false, msg: "Failed Update Table!" });
  }
};

export const getTable = async (req: Request, res: Response) => {
  const id = req.params.id ? Math.abs(+req.params.id) : 0;
  const tIdx = req.params.tIdx ? Math.abs(+req.params.tIdx) : 0;
  const staff: Staff = res.locals.staff;

  if (isNaN(id) || isNaN(tIdx)) {
    return res.status(400).json({ ok: false, msg: "Invalid Request!" });
  }

  const result = await client.table.findFirst({
    where: {
      index: tIdx,
      containerId: id,
    },
  });

  return res.json({ ok: true, result });
};

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const result = await client.tableContainer.findMany({
      where: {
        archived: false,
      },
      include: {
        tables: {
          where: {
            archived: false,
          },
        },
      },
      orderBy: {
        index: "asc",
      },
    });

    return res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    return res.json({ ok: false, msg: "Failed Load Tables" });
  }
};
