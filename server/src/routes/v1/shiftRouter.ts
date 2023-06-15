import { getCurrentShift, openShift } from "@controller/v1/shiftController";
import { authMid } from "@middlewares/auth";
import express from "express";

const shiftRouter = express.Router();

shiftRouter.route("/current").get(authMid, getCurrentShift);
shiftRouter.route("/open").post(authMid, openShift);

export default shiftRouter;
