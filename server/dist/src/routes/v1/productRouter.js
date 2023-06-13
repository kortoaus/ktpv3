"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var productController_1 = require("@controller/v1/productController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var productRouter = express_1.default.Router();
productRouter.route("/option").get(auth_1.authMid, productController_1.getProductOptions);
productRouter.route("/").post(auth_1.authMid, productController_1.updateProduct).get(auth_1.authMid, productController_1.getProducts);
productRouter
    .route("/:id(\\d+)")
    .post(auth_1.authMid, productController_1.updateProduct)
    .get(auth_1.authMid, productController_1.getProduct);
exports.default = productRouter;
