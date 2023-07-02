import { io } from "socket.io-client";

const root = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const socket = io(root, {
  transports: ["websocket"],
});
