"use client";
import DataLoading from "@/components/ui/DataLoading";
import Required from "@/components/ui/form/Required";
import { BeRemoved, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { TableContainer } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: TableContainer;
};

type FormDataProps = {
  id?: number;
  name: string;
  index: number;
  archived: boolean;
};

const initValue: FormDataProps = {
  name: "",
  archived: false,
  index: 999,
};

export default function TableContainerUpdate({ data }: Props) {
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
      : initValue,
  });

  const [update, { result, loading }] = useMutation<ApiResultType>(
    `/api/tcontainer${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push("/tcontainer");
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, router]);

  const updateHandler = (data: FormDataProps) => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    if (Boolean(data.archived)) {
      const msg = `${data.name} ${BeRemoved}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    update({ ...data, index: +data.index });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link href={`/tcontainer`} prefetch>
        <button className="BasicBtn mb-2">Go Back To List</button>
      </Link>
      <h1 className="mb-2 border-b pb-2">Update Container</h1>

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

          <div className="form-element-group">
            <label>
              Index
              <Required />
            </label>
            <input
              type="number"
              {...register("index", { required: RequiredField })}
            />
            {errors.index?.message && (
              <p className="err">{errors.index.message}</p>
            )}
          </div>

          {data !== undefined && (
            <div className="form-element-group">
              <label className="text-red-500">Archived</label>
              <input type="checkbox" {...register("archived")} />
            </div>
          )}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
