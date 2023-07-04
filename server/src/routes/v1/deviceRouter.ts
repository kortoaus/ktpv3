import { getBuffetClasses } from "@controller/v1/buffetController";
import {
  cancelOrder,
  deviceMe,
  getAllProducts,
  getDevice,
  getDevices,
  getLastInvoice,
  getTableData,
  kickDrawer,
  moveTable,
  openTable,
  payment,
  placeOrder,
  shopData,
  toggleKitchen,
  toggleOOS,
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

deviceRouter.route("/kd").post(authMid, kickDrawer);

// Datas
deviceRouter.route("/me").get(authDeviceMid, deviceMe);
deviceRouter.route("/shift").get(authDeviceMid, getCurrentShift);
deviceRouter.route("/shift/lastreceipt").post(authDeviceMid, getLastInvoice);
deviceRouter.route("/shift/kitchen").post(authDeviceMid, toggleKitchen);
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

deviceRouter.route("/kiosk/table").get(authDeviceMid, getTableData);

// Product
deviceRouter.route("/product").get(authDeviceMid, getAllProducts);
deviceRouter.route("/product/:id(\\d+)/oos").post(authDeviceMid, toggleOOS);

// Orders
deviceRouter.route(`${saleIdPath}/place`).post(authDeviceMid, placeOrder);
deviceRouter.route(`${saleIdPath}/cancel`).post(authDeviceMid, cancelOrder);
deviceRouter.route(`${saleIdPath}/move`).post(authDeviceMid, moveTable);
// Payment
deviceRouter.route(`${saleIdPath}/payment`).post(authDeviceMid, payment);

export default deviceRouter;
