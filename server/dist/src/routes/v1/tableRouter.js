"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tableController_1 = require("@controller/v1/tableController");
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var tableRouter = express_1.default.Router();
tableRouter
    .route("/container")
    .post(auth_1.authMid, tableController_1.updateTableContainer)
    .get(auth_1.authMid, tableController_1.getTableContainers);
tableRouter
    .route("/container/:id(\\d+)")
    .post(auth_1.authMid, tableController_1.updateTableContainer)
    .get(auth_1.authMid, tableController_1.getTableContainer);
tableRouter
    .route("/container/:id(\\d+)/table")
    .get(auth_1.authMid, tableController_1.getTableContainerWithTables);
tableRouter
    .route("/container/:id(\\d+)/table/:tIdx(\\d+)")
    .post(auth_1.authMid, tableController_1.updateTable)
    .get(auth_1.authMid, tableController_1.getTable);
exports.default = tableRouter;
