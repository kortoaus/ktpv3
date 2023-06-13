import { ImageUpload } from "@controller/v1/fileController";
import upload from "@libs/fileStore";
import { authMid } from "@middlewares/auth";
import express from "express";

const fileRouter = express.Router();

fileRouter.route("/").post(authMid, upload.single("file"), ImageUpload);
export default fileRouter;
