import { io } from "socket.io-client";

const root = "http://localhost:3000";

export const socket = io(root, {
  transports: ["websocket"],
});
