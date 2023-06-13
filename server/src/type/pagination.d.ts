export type PaginationParams = {
  page?: number;
  keyword?: string;
  offset?: number;
};

export type PaginationResponse<T> = {
  ok: boolean;
  msg?: string;
  result: T[];
  hasPrev: boolean;
  hasNext: boolean;
  totalPages: number;
  pageSize: number;
};
