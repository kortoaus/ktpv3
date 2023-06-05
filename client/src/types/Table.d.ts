import { TableContainer } from "./model";

export type TableContainerWithTables = TableContainer & {
  tables: {
    id: number;
    name: string;
    index: number;
  }[];
};
