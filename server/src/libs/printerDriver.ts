import { connect } from "net";
import {
  OrderTicketType,
  ReceiptTicketType,
  ShiftTicketType,
} from "../type/Ticket";
import {
  OrderTicketBuffer,
  ReceiptBuffer,
  ShiftBuffer,
  kickDrawerBuffer,
} from "./printerTemplate";
import { Printer } from "@prisma/client";

export const sendPrint = (host: string, port: number, buffer: any) => {
  try {
    const conn = connect(
      {
        host: host,
        port: port,
        timeout: 3000,
      },
      () => {
        conn.write(buffer, () => {
          conn.destroy();
        });
      }
    );

    conn.on("error", (err) => {
      console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
};

export const printOrderTicket = async (data: OrderTicketType) => {
  const { ip, port } = data;
  const buffer = await OrderTicketBuffer(data);
  sendPrint(ip, port, buffer);
};

export const printReceipt = async (data: ReceiptTicketType) => {
  const { ip, port } = data;
  const buffer = await ReceiptBuffer(data);
  sendPrint(ip, port, buffer);
};

export const printKickDrawer = async (data: Printer) => {
  const { ip, port } = data;
  const buffer = kickDrawerBuffer();
  sendPrint(ip, port, buffer);
};

export const printClosedShift = async (data: ShiftTicketType) => {
  const { ip, port } = data;
  const buffer = await ShiftBuffer(data);
  sendPrint(ip, port, buffer);
};
