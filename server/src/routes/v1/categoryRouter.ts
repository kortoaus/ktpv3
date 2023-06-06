import {
  getCategories,
  getCategory,
  updateCategory,
} from "@controller/v1/categoryController";
import { authMid } from "@middlewares/auth";
import express from "express";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(authMid, updateCategory)
  .get(authMid, getCategories);

categoryRouter
  .route("/:id(\\d+)")
  .post(authMid, updateCategory)
  .get(authMid, getCategory);

export default categoryRouter;
