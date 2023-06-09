import {
  getPrinter,
  getPrinters,
  updatePrinter,
} from "@controller/v1/printerController";
import { authMid } from "@middlewares/auth";
import express from "express";

const printerRouter = express.Router();

printerRouter.route("/").post(authMid, updatePrinter).get(authMid, getPrinters);

printerRouter
  .route("/:id(\\d+)")
  .post(authMid, updatePrinter)
  .get(authMid, getPrinter);

export default printerRouter;
