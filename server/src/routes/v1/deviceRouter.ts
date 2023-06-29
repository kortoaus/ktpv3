import { getBuffetClasses } from "@controller/v1/buffetController";
import {
  cancelOrder,
  deviceMe,
  getDevice,
  getDevices,
  getTableData,
  openTable,
  payment,
  placeOrder,
  shopData,
  updateBuffetData,
  updateBuffetTime,
  updateDevice,
} from "@controller/v1/deviceController";
import { getCurrentShift } from "@controller/v1/shiftController";
import { getStaffByCode } from "@controller/v1/staffController";
import { getAllTables } from "@controller/v1/tableController";
import { authDeviceMid, authMid } from "@middlewares/auth";
import express from "express";

const saleIdPath = "/sale/:id(\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12})";

const deviceRouter = express.Router();

deviceRouter.route("/").post(authMid, updateDevice).get(authMid, getDevices);
deviceRouter
  .route("/:id(\\d+)")
  .post(authMid, updateDevice)
  .get(authMid, getDevice);

// Datas
deviceRouter.route("/me").get(authDeviceMid, deviceMe);
deviceRouter.route("/shift").get(authDeviceMid, getCurrentShift);
deviceRouter.route("/shop").get(authDeviceMid, shopData);
deviceRouter.route("/buffet").get(authDeviceMid, getBuffetClasses);
deviceRouter.route("/staff").post(authDeviceMid, getStaffByCode);
deviceRouter.route("/table").get(authDeviceMid, getAllTables);

// Table
deviceRouter
  .route("/table/:id(\\d+)")
  .get(authDeviceMid, getTableData)
  .post(authDeviceMid, openTable);
// Table Buffet
deviceRouter
  .route("/table/:id(\\d+)/buffet")
  .post(authDeviceMid, updateBuffetData);
deviceRouter
  .route("/table/:id(\\d+)/btime")
  .post(authDeviceMid, updateBuffetTime);

// Orders
deviceRouter.route(`${saleIdPath}/place`).post(authDeviceMid, placeOrder);
deviceRouter.route(`${saleIdPath}/cancel`).post(authDeviceMid, cancelOrder);
// Payment
deviceRouter.route(`${saleIdPath}/payment`).post(authDeviceMid, payment);

export default deviceRouter;
