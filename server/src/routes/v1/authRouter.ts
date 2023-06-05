import { me, signIn } from "@controller/v1/authController";
import { authMid } from "@middlewares/auth";
import express from "express";

const authRouter = express.Router();

authRouter.route("/signin").post(signIn);
authRouter.route("/me").post(authMid, me);

export default authRouter;
