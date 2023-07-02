export type ApiResultType = {
  ok: boolean;
  msg?: string;
};

export type idCtx = {
  params: {
    id: string;
  };
};

export type PopUpProps = {
  open: boolean;
  onClose: () => void;
};

export type PaginationResult<T> = {
  ok: boolean;
  msg?: string;
  result: T[];
  hasPrev: boolean;
  hasNext: boolean;
  totalPages: number;
  pageSize: number;
};

export type PagingProps = {
  current: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  keyword: string;
};
