import express, { Request, Response } from "express";
import http from "http";
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

import authRouter from "@routes/v1/authRouter";
import shiftRouter from "@routes/v1/shiftRouter";
import tableRouter from "@routes/v1/tableRouter";
import categoryRouter from "@routes/v1/categoryRouter";
import buffetRouter from "@routes/v1/buffetRouter";
import productRouter from "@routes/v1/productRouter";
import printerRouter from "@routes/v1/printerRouter";
import fileRouter from "@routes/v1/fileRouter";

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  optionsSuccessStatus: 200,
};

// Initialize
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, _, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/imgs", express.static("images"));

// Routes
const apiRoot = `/api`;

app.use(`${apiRoot}/v1/auth`, authRouter);
app.use(`${apiRoot}/v1/shift`, shiftRouter);
app.use(`${apiRoot}/v1/table`, tableRouter);
app.use(`${apiRoot}/v1/category`, categoryRouter);
app.use(`${apiRoot}/v1/buffet`, buffetRouter);
app.use(`${apiRoot}/v1/product`, productRouter);
app.use(`${apiRoot}/v1/printer`, printerRouter);
app.use(`${apiRoot}/v1/file`, fileRouter);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
