"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authController_1 = require("@controller/v1/authController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var authRouter = express_1.default.Router();
authRouter.route("/signin").post(authController_1.signIn);
authRouter.route("/me").post(auth_1.authMid, authController_1.me);
exports.default = authRouter;
