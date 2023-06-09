"use client";
import DataLoading from "@/components/ui/DataLoading";
import Required from "@/components/ui/form/Required";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { Table } from "@/types/model";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  cId: number;
  tId: number;
  data?: Table;
};

type FormDataProps = {
  id?: number;
  name: string;
  archived: boolean;
};

const initValue: FormDataProps = {
  name: "",
  archived: false,
};

export default function TableUpdate({ cId, tId, data }: Props) {
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
    `/api/tcontainer/${cId}/table/${tId}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(`/tcontainer/${cId}/table`);
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, cId, router]);

  const updateHandler = (data: FormDataProps) => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    if (Boolean(data.archived)) {
      const msg = `${data.name} ${BeDisabled}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    update({ ...data });
  };

  return (
    <div className="w-full max-w-md">
      {loading ? (
        <DataLoading />
      ) : (
        <form className="defaultForm" onSubmit={handleSubmit(updateHandler)}>
          <div className="form-element-group">
            <label>
              Name
              <Required />
            </label>
            <input
              type="text"
              {...register("name", { required: RequiredField })}
            />
            {errors.name?.message && (
              <p className="err">{errors.name.message}</p>
            )}
          </div>

          {data !== undefined && (
            <div className="form-element-group">
              <label className="text-red-500">Disabled</label>
              <input type="checkbox" {...register("archived")} />
            </div>
          )}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
