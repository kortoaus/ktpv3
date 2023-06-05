import { getCurrentShift } from "@controller/v1/shiftController";
import { authMid } from "@middlewares/auth";
import express from "express";

const shiftRouter = express.Router();

shiftRouter.route("/current").get(authMid, getCurrentShift);

export default shiftRouter;
