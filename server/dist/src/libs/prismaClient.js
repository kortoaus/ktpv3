"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var client = global.client || new client_1.PrismaClient({ log: [] });
if (process.env.NODE_ENV === "development")
    global.client = client;
exports.default = client;
