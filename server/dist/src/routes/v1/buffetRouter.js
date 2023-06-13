"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var buffetController_1 = require("@controller/v1/buffetController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var buffetRouter = express_1.default.Router();
buffetRouter
    .route("/")
    .post(auth_1.authMid, buffetController_1.updateBuffetClass)
    .get(auth_1.authMid, buffetController_1.getBuffetClasses);
buffetRouter
    .route("/:id(\\d+)")
    .post(auth_1.authMid, buffetController_1.updateBuffetClass)
    .get(auth_1.authMid, buffetController_1.getBuffetClass);
exports.default = buffetRouter;
