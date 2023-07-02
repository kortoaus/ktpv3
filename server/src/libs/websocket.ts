import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Device } from "@prisma/client";

let io: Server;

const initializeWebSocket = (server: HttpServer, corsOptions: any): Server => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join_pos", (data) => {
      socket.join("refresh");
    });

    socket.on("join_table", (data: Device | undefined) => {
      socket.join(`table_${data?.tableId || 0}`);
    });

    socket.on("refresh", () => {
      socket.to("refresh").emit("");
    });

    socket.on("refresh_table", (tableId: number) => {
      socket.to(`table_${tableId}`).emit("");
    });
  });

  console.log(`Socket Initialized!`);

  return io;
};

export { initializeWebSocket, io };
