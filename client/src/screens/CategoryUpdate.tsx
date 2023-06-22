"use client";
import DataLoading from "@/components/ui/DataLoading";
import Archived from "@/components/ui/form/Archived";
import IntInput from "@/components/ui/form/IntInput";
import Required from "@/components/ui/form/Required";
import TextInput from "@/components/ui/form/TextInput";
import ToggleCheckbox from "@/components/ui/form/ToggleCheckbox";
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
  hoc: boolean;
  archived: boolean;
};

const initValue: FormDataProps = {
  name: "",
  archived: false,
  index: 999,
  hoc: false,
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
          <TextInput
            required
            register={register("name", { required: RequiredField })}
            label="Category Name"
            error={errors.name}
          />

          <IntInput
            label="Index"
            required
            register={register("index", { required: RequiredField })}
            error={errors.index}
          />

          <ToggleCheckbox
            id={`hoc`}
            label={`Hide on Kiosk`}
            register={register("hoc")}
          />

          {data !== undefined && <Archived register={register("archived")} />}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
