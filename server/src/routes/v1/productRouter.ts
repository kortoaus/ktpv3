import { getProductOptions } from "@controller/v1/productController";
import { authMid } from "@middlewares/auth";
import express from "express";

const productRouter = express.Router();

productRouter.route("/option").get(authMid, getProductOptions);

// productRouter
//   .route("/container/:id(\\d+)")
//   .post(authMid, updateTableContainer)
//   .get(authMid, getTableContainer);

export default productRouter;
