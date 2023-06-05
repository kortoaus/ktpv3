/**
 * Model Printer
 *
 */
export type Printer = {
  id: number;
  shopId: number;
  label: string;
  ip: string;
  port: number;
  isMain: boolean;
  isSplit: boolean;
  isLabel: boolean;
  hasDrawer: boolean;
  archived: boolean;
};

/**
 * Model Staff
 *
 */
export type Staff = {
  id: number;
  name: string;
  code: string;
  phone: number;
  createdAt: Date;
  updatedAt: Date;
  permission: string;
  archived: boolean;
};

/**
 * Model Category
 *
 */
export type Category = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
};

/**
 * Model BuffetClass
 *
 */
export type BuffetClass = {
  id: number;
  mId: number | null;
  name: string;
  priceA: number;
  priceWA: number;
  priceB: number;
  priceWB: number;
  priceC: number;
  priceWC: number;
  nameA: string;
  nameB: string;
  nameC: string;
  archived: boolean;
  createdAt: Date;
};

/**
 * Model Product
 *
 */
export type Product = {
  id: number;
  mId: number | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number | null;
  name: string;
  subName: string | null;
  regular_price: number;
  sale_price: number;
  const: number;
  printer: string;
  options: string;
  buffetOnly: boolean;
  buffetPrice: string;
  bClasses: string;
  index: number;
};

/**
 * Model CashInOut
 *
 */
export type CashInOut = {
  id: number;
  staffName: string;
  cashIn: number;
  cashOut: number;
  note: string;
  createdAt: Date;
};

/**
 * Model TableContainer
 *
 */
export type TableContainer = {
  id: number;
  index: number;
  name: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Model Table
 *
 */
export type Table = {
  id: number;
  name: string;
  index: number;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  containerId: number | null;
  archived: boolean;
};

/**
 * Model Shift
 *
 */
export type Shift = {
  id: number;
  openAt: Date;
  closedAt: Date | null;
  updatedAt: Date;
};
