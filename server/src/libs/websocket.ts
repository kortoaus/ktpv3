import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

const initializeWebSocket = (server: HttpServer, corsOptions: any): Server => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join_pos", (data) => {
      socket.join("refresh");
    });

    socket.on("join_table", (data) => {
      socket.join("refresh");
    });

    socket.on("join_device", (data) => {
      socket.join("refresh");
    });

    socket.on("refresh", () => {
      socket.to("refresh").emit("");
    });
    // socket.on("open_table", (data) => {
    //   if (data.room) {
    //     socket.to(data.room).emit("table_receive", data);
    //   }
    // });
    // socket.on("emit_company", (data) => {
    //   if (data.room) {
    //     socket.to(data.room).emit("company_receive", data);
    //   }
    // });
    // socket.on("emit_pos", (data) => {
    //   if (data.room) {
    //     socket.to(data.room).emit("pos_receive", data);
    //   }
    // });
    // socket.on("join_table", (data) => {
    //   console.log("Joined_table ", data, socket.id);
    //   socket.join(data);
    // });
    // socket.on("join_company", (data) => {
    //   console.log("Joined_company ", data, socket.id);
    //   socket.join(data);
    // });
    // socket.on("join_pos", (data) => {
    //   console.log("Joined_pos ", data, socket.id);
    //   socket.join(data);
    // });
  });

  console.log(`Socket Initialized!`);

  return io;
};

export { initializeWebSocket, io };
