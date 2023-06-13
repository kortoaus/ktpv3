"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path = require("path");
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, new Date().getTime() + ext);
    },
});
var upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
