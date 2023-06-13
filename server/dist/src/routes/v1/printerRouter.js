"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var printerController_1 = require("@controller/v1/printerController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var printerRouter = express_1.default.Router();
printerRouter.route("/").post(auth_1.authMid, printerController_1.updatePrinter).get(auth_1.authMid, printerController_1.getPrinters);
printerRouter
    .route("/:id(\\d+)")
    .post(auth_1.authMid, printerController_1.updatePrinter)
    .get(auth_1.authMid, printerController_1.getPrinter);
exports.default = printerRouter;
