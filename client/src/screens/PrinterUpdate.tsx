"use client";
import DataLoading from "@/components/ui/DataLoading";
import Archived from "@/components/ui/form/Archived";
import IntInput from "@/components/ui/form/IntInput";
import TextInput from "@/components/ui/form/TextInput";
import ToggleCheckbox from "@/components/ui/form/ToggleCheckbox";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { Printer } from "@/types/model";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: Printer;
  query: {
    keyword: number;
    page: string;
  };
};

type FormDataProps = {
  id?: number;
  label: string;
  ip: string;
  port: number;
  hasDrawer: boolean;
  isSplit: boolean;
  isMain: boolean;
  archived: boolean;
};

const initValue: FormDataProps = {
  label: "",
  ip: "",
  port: 9100,
  hasDrawer: false,
  isMain: false,
  isSplit: false,
  archived: false,
};

export default function PrinterUpdate({ data, query }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: data
      ? {
          ...data,
        }
      : {
          ...initValue,
        },
  });

  const [update, { result, loading }] = useMutation<ApiResultType>(
    `/api/printer${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(
        `/printer?page=${query.page || 1}&keyword=${query.keyword || ""}`
      );
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, router, query]);

  const updateHandler = (data: FormDataProps) => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    if (Boolean(data.archived)) {
      const msg = `${data.label} ${BeDisabled}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    update({ ...data });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {loading ? (
        <DataLoading />
      ) : (
        <form className="defaultForm" onSubmit={handleSubmit(updateHandler)}>
          <TextInput
            label="Label"
            required
            register={register("label", { required: RequiredField })}
            placeholder="eg. New Printer"
            error={errors.label}
          />

          <TextInput
            label="IP Address"
            required
            register={register("ip", { required: RequiredField })}
            placeholder="eg. 192.168.1.123"
            error={errors.ip}
          />

          <IntInput
            label="Port"
            required
            register={register("port", {
              required: RequiredField,
              setValueAs: (val) => +val,
            })}
            placeholder="eg. 9100"
            error={errors.port}
          />

          <ToggleCheckbox
            id="is_main"
            label="Is it a receipt printer?"
            register={register("isMain")}
          />

          <ToggleCheckbox
            id="has_drawer"
            label="Does this printer have a cash drawer?"
            register={register("hasDrawer")}
          />

          <ToggleCheckbox
            id="is_split"
            label="Print Qty on each line?"
            register={register("isSplit")}
          />

          {data !== undefined && <Archived register={register("archived")} />}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
