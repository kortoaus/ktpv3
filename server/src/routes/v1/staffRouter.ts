import {
  getStaff,
  getStaffs,
  updateStaff,
} from "@controller/v1/staffController";
import { authMid } from "@middlewares/auth";
import express from "express";

const staffRouter = express.Router();

staffRouter.route("/").post(authMid, updateStaff).get(authMid, getStaffs);

staffRouter
  .route("/:id(\\d+)")
  .post(authMid, updateStaff)
  .get(authMid, getStaff);

export default staffRouter;
