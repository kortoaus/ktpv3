import {
  getBuffetClass,
  getBuffetClasses,
  updateBuffetClass,
} from "@controller/v1/buffetController";
import { authMid } from "@middlewares/auth";
import express from "express";

const buffetRouter = express.Router();

buffetRouter
  .route("/")
  .post(authMid, updateBuffetClass)
  .get(authMid, getBuffetClasses);

buffetRouter
  .route("/:id(\\d+)")
  .post(authMid, updateBuffetClass)
  .get(authMid, getBuffetClass);

export default buffetRouter;
