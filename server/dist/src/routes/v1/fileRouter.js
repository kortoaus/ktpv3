"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileController_1 = require("@controller/v1/fileController");
var fileStore_1 = __importDefault(require("@libs/fileStore"));
var auth_1 = require("@middlewares/auth");
var express_1 = __importDefault(require("express"));
var fileRouter = express_1.default.Router();
fileRouter.route("/").post(auth_1.authMid, fileStore_1.default.single("file"), fileController_1.ImageUpload);
exports.default = fileRouter;
