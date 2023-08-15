import {
  getCashios,
  getReceipt,
  getReceipts,
  printReceiptHandler,
} from "@controller/v1/saleController";
import { authMid } from "@middlewares/auth";
import express from "express";

const saleRouter = express.Router();

const saleIdPath = "/:id(\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12})";
// deviceRouter.route(`${saleIdPath}/place`).post(authDeviceMid, placeOrder);

saleRouter.route("/").get(authMid, getReceipts);
saleRouter.route(saleIdPath).get(authMid, getReceipt);
saleRouter.route(`${saleIdPath}/print`).get(authMid, printReceiptHandler);

saleRouter.route("/cashio").get(authMid, getCashios);

export default saleRouter;
