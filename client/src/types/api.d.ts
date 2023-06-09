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
