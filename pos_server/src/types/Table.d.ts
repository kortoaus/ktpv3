import { SaleWithTotal } from "./Sale";
import { Sale, Table, TableContainer } from "./model";

type TableContainerWithTables = TableContainer & {
  tables: Table[];
};

type TableWithSales = Table & {
  sale: SaleWithTotal | null;
};
