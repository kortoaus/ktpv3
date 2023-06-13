"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var categoryController_1 = require("@controller/v1/categoryController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var categoryRouter = express_1.default.Router();
categoryRouter
    .route("/")
    .post(auth_1.authMid, categoryController_1.updateCategory)
    .get(auth_1.authMid, categoryController_1.getCategories);
categoryRouter
    .route("/:id(\\d+)")
    .post(auth_1.authMid, categoryController_1.updateCategory)
    .get(auth_1.authMid, categoryController_1.getCategory);
exports.default = categoryRouter;
