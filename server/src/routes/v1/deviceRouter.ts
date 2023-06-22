import { getBuffetClasses } from "@controller/v1/buffetController";
import {
  deviceMe,
  getDevice,
  getDevices,
  getTableData,
  openTable,
  updateDevice,
} from "@controller/v1/deviceController";
import { getCurrentShift } from "@controller/v1/shiftController";
import { getStaffByCode } from "@controller/v1/staffController";
import { getAllTables } from "@controller/v1/tableController";
import { authDeviceMid, authMid } from "@middlewares/auth";
import express from "express";

const deviceRouter = express.Router();

deviceRouter.route("/").post(authMid, updateDevice).get(authMid, getDevices);
deviceRouter
  .route("/:id(\\d+)")
  .post(authMid, updateDevice)
  .get(authMid, getDevice);

deviceRouter.route("/me").get(authDeviceMid, deviceMe);
deviceRouter.route("/shift").get(authDeviceMid, getCurrentShift);

deviceRouter.route("/buffet").get(authDeviceMid, getBuffetClasses);

deviceRouter.route("/staff").post(authDeviceMid, getStaffByCode);

deviceRouter.route("/table").get(authDeviceMid, getAllTables);

deviceRouter
  .route("/table/:id(\\d+)")
  .get(authDeviceMid, getTableData)
  .post(authDeviceMid, openTable);

export default deviceRouter;
