"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shiftController_1 = require("@controller/v1/shiftController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var shiftRouter = express_1.default.Router();
shiftRouter.route("/current").get(auth_1.authMid, shiftController_1.getCurrentShift);
exports.default = shiftRouter;
