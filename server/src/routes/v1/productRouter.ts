import {
  getProduct,
  getProductOptions,
  updateProduct,
} from "@controller/v1/productController";
import { authMid } from "@middlewares/auth";
import express from "express";

const productRouter = express.Router();

productRouter.route("/option").get(authMid, getProductOptions);

productRouter.route("/").post(authMid, updateProduct);

productRouter
  .route("/:id(\\d+)")
  .post(authMid, updateProduct)
  .get(authMid, getProduct);

export default productRouter;
