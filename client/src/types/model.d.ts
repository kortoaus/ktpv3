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
  hoc: boolean;
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
  containerId: number;
  archived: boolean;
};

/**
 * Model Device
 *
 */
export type Device = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  name: string;
  ip: string | null;
  tableId: number | null;
  archived: boolean;
};

/**
 * Model DeviceToken
 *
 */
export type DeviceToken = {
  id: number;
  payload: string;
  deviceId: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Model Shift
 *
 */
export type Shift = {
  id: number;
  openStaffId: number;
  closeStaffId: number;
  openStaff: string;
  closeStaff: string;
  openCash: number;
  closeCash: number;
  openNote: string;
  closeNote: string;
  openAt: Date;
  closedAt: Date | null;
  holiday: boolean;
  updatedAt: Date;
  ppA: number;
  ppB: number;
  ppC: number;
  pp: number;
  subTotal: number;
  charged: number;
  total: number;
  credit: number;
  creditSurcharge: number;
  creditPaid: number;
  cashPaid: number;
  discount: number;
  c_ms: number;
  c_fs: number;
  c_my: number;
  c_fy: number;
  c_mm: number;
  c_fm: number;
};

/**
 * Model Sale
 *
 */
export type Sale = {
  id: string;
  note: string;
  shiftId: number;
  tableId: number;
  tableName: string;
  ppA: number;
  ppB: number;
  ppC: number;
  pp: number;
  buffetId: number | null;
  buffetStarted: Date | null;
  openStaffId: number;
  closeStaffId: number;
  openStaff: string;
  closeStaff: string;
  openAt: Date;
  closedAt: Date | null;
  updatedAt: Date;
  logs: string;
  subTotal: number;
  charged: number;
  total: number;
  cash: number;
  credit: number;
  creditSurcharge: number;
  creditPaid: number;
  cashPaid: number;
  discount: number;
  change: number;
  customerProperty: string;
};

/**
 * Model SaleLine
 *
 */
export type SaleLine = {
  id: number;
  saleId: string;
  productId: number;
  staff: string;
  desc: string;
  price: number;
  qty: number;
  discount: number;
  total: number;
  options: string;
  cancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
  note: string;
};

/**
 * Model CashIO
 *
 */
export type CashIO = {
  id: string;
  note: string;
  shiftId: number;
  staffId: number;
  staff: string;
  cashIn: number;
  cashOut: number;
  createdAt: Date;
  updatedAt: Date;
};
