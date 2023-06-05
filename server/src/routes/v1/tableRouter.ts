import {
  getTableContainers,
  updateTableContainer,
  getTableContainer,
  getTableContainerWithTables,
  updateTable,
  getTable,
} from "@controller/v1/tableController";
import { authMid } from "@middlewares/auth";
import express from "express";

const tableRouter = express.Router();

tableRouter
  .route("/container")
  .post(authMid, updateTableContainer)
  .get(authMid, getTableContainers);

tableRouter
  .route("/container/:id(\\d+)")
  .post(authMid, updateTableContainer)
  .get(authMid, getTableContainer);

tableRouter
  .route("/container/:id(\\d+)/table")
  .get(authMid, getTableContainerWithTables);

tableRouter
  .route("/container/:id(\\d+)/table/:tIdx(\\d+)")
  .post(authMid, updateTable)
  .get(authMid, getTable);

export default tableRouter;
