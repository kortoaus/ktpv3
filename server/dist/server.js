"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors = require("cors");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var port = process.env.PORT;
var authRouter_1 = __importDefault(require("@routes/v1/authRouter"));
var shiftRouter_1 = __importDefault(require("@routes/v1/shiftRouter"));
var tableRouter_1 = __importDefault(require("@routes/v1/tableRouter"));
var categoryRouter_1 = __importDefault(require("@routes/v1/categoryRouter"));
var buffetRouter_1 = __importDefault(require("@routes/v1/buffetRouter"));
var productRouter_1 = __importDefault(require("@routes/v1/productRouter"));
var printerRouter_1 = __importDefault(require("@routes/v1/printerRouter"));
var fileRouter_1 = __importDefault(require("@routes/v1/fileRouter"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));
var corsOptions = {
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    optionsSuccessStatus: 200,
};
// Initialize
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use(function (req, _, next) {
    console.log(req.method, req.url);
    next();
});
app.use("/imgs", express_1.default.static("images"));
// Routes
var apiRoot = "/api";
app.use("".concat(apiRoot, "/v1/auth"), authRouter_1.default);
app.use("".concat(apiRoot, "/v1/shift"), shiftRouter_1.default);
app.use("".concat(apiRoot, "/v1/table"), tableRouter_1.default);
app.use("".concat(apiRoot, "/v1/category"), categoryRouter_1.default);
app.use("".concat(apiRoot, "/v1/buffet"), buffetRouter_1.default);
app.use("".concat(apiRoot, "/v1/product"), productRouter_1.default);
app.use("".concat(apiRoot, "/v1/printer"), printerRouter_1.default);
app.use("".concat(apiRoot, "/v1/file"), fileRouter_1.default);
server.listen(port, function () {
    console.log("[server]: Server is running at http://localhost:".concat(port));
});
