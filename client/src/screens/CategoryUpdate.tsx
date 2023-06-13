"use client";
import DataLoading from "@/components/ui/DataLoading";
import Required from "@/components/ui/form/Required";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { Category } from "@/types/model";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: Category;
  query: {
    keyword: number;
    page: string;
  };
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

export default function CategoryUpdate({ data, query }: Props) {
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
    `/api/category${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(
        `/category?page=${query.page || 1}&keyword=${query.keyword || ""}`
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
      const msg = `${data.name} ${BeDisabled}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    update({ ...data, index: +data.index });
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
