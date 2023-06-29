import { getReceipt, getReceipts } from "@controller/v1/saleController";
import { getStaff, updateStaff } from "@controller/v1/staffController";
import { authMid } from "@middlewares/auth";
import express from "express";

const saleRouter = express.Router();

const saleIdPath = "/:id(\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12})";
// deviceRouter.route(`${saleIdPath}/place`).post(authDeviceMid, placeOrder);

saleRouter.route("/").get(authMid, getReceipts);
saleRouter.route(saleIdPath).get(authMid, getReceipt);

export default saleRouter;
