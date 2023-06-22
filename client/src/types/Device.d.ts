import { Device } from "./model";

type DeviceTable = {
  id: number;
  name: string;
  container: {
    id: number;
    name: string;
  };
};

export type DeviceWithTable = Device & {
  table: null | DeviceTable;
};
