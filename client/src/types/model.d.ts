/**
 * Model Shop
 *
 */
export type Shop = {
  id: number;
  abn: string;
  code: string;
  name: string;
  phone: string;
  logo: string;
  address1: string;
  address2: string;
  suburb: string;
  state: string;
  postcode: string;
  createdAt: Date;
  updatedAt: Date;
  creditRate: number;
  cashPointRate: number;
  creditPointRate: number;
  apiKey: string;
  customerKey: string;
  holidayCharge: number;
};

/**
 * Model Printer
 *
 */
export type Printer = {
  id: number;
  label: string;
  ip: string;
  port: number;
  isMain: boolean;
  isSplit: boolean;
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
  index: number;
  archived: boolean;
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
  priceB: number;
  priceC: number;
  h_priceA: number;
  h_priceB: number;
  h_priceC: number;
  nameA: string;
  nameB: string;
  nameC: string;
  stayTime: number;
  orderTime: number;
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
  imgId: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number | null;
  name: string;
  price: number;
  cost: number;
  isBuffet: boolean;
  buffetPrice: string;
  printerIds: string;
  buffetIds: string;
  options: string;
  index: number;
  hideKiosk: boolean;
  outOfStock: boolean;
  archived: boolean;
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
