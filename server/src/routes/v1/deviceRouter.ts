import {
  getDevice,
  getDevices,
  updateDevice,
} from "@controller/v1/deviceController";
import { authMid } from "@middlewares/auth";
import express from "express";

const deviceRouter = express.Router();

deviceRouter.route("/").post(authMid, updateDevice).get(authMid, getDevices);

deviceRouter
  .route("/:id(\\d+)")
  .post(authMid, updateDevice)
  .get(authMid, getDevice);

export default deviceRouter;
