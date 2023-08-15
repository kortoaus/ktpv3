"use client";
import DataLoading from "@/components/ui/DataLoading";
import Archived from "@/components/ui/form/Archived";
import IntInput from "@/components/ui/form/IntInput";
import TextInput from "@/components/ui/form/TextInput";
import { HandlerCheckbox } from "@/components/ui/form/ToggleCheckbox";
import {
  BeDisabled,
  InvalidMobile,
  RequiredField,
  StillUpdating,
} from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { isMobile } from "@/libs/util";
import { StaffRole } from "@/types/Staff";
import { ApiResultType } from "@/types/api";
import { Staff } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: Staff;
  query: {
    keyword: number;
    page: string;
  };
};

type FormDataProps = {
  name: string;
  code: string;
  phone?: number;
  permission: StaffRole;
  archived: boolean;
};

const initValue: FormDataProps = {
  name: "",
  code: "",
  permission: {
    isDirector: true,
  },
  archived: false,
};

export default function StaffUpdate({ data, query }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: data
      ? {
          ...data,
          permission: {
            ...JSON.parse(data.permission),
          },
        }
      : {
          ...initValue,
        },
  });

  const [update, { result, loading }] = useMutation<ApiResultType>(
    `/api/staff${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(
        `/staff?page=${query.page || 1}&keyword=${query.keyword || ""}`
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

    update({ ...data, permission: JSON.stringify(data.permission) });
  };

  const watched = watch();

  const permissionChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prev = { ...watched.permission };
    prev[e.target.name] = Boolean(e.target.checked);
    setValue("permission", prev);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        href={`/staff?page=${query.page || 1}&keyword=${query.keyword || ""}`}
        prefetch
      >
        <button className="BasicBtn mb-2">Go Back To List</button>
      </Link>
      <h1 className="mb-2 border-b pb-2">Update Staff</h1>

      {loading ? (
        <DataLoading />
      ) : (
        <form className="defaultForm" onSubmit={handleSubmit(updateHandler)}>
          <TextInput
            label="Name"
            required
            register={register("name", { required: RequiredField })}
            placeholder="eg. New Staff"
            error={errors.name}
          />
          <TextInput
            label="Code"
            required
            register={register("code", {
              required: RequiredField,
              validate: (val) => {
                if (val && isNaN(Number(val))) {
                  return "Number Only!";
                }
                if (val && val.includes(".")) {
                  return "Number Only!";
                }
              },
            })}
            placeholder="eg. 0000"
            error={errors.code}
          />
          <TextInput
            label="Phone"
            required
            register={register("phone", {
              required: RequiredField,
              validate: (val) => {
                if (val && !isMobile(val)) {
                  return InvalidMobile;
                }
              },
              setValueAs: (val) => +val,
            })}
            placeholder="eg. 434123123"
            error={errors.phone}
          />

          {/*  */}
          {/* <div>
            <h4>Permissions</h4>
            <HandlerCheckbox
              checked={watched.permission[`isDirector`] || false}
              label="Director"
              id="isDirector"
              onChange={(e) => permissionChangeHandler(e)}
            />

            <HandlerCheckbox
              checked={watched.permission[`isOpen`] || false}
              label="Shop Open/Close"
              id="isOpen"
              onChange={(e) => permissionChangeHandler(e)}
            />

            <HandlerCheckbox
              checked={watched.permission[`isTable`] || false}
              label="Manage Table"
              id="isTable"
              onChange={(e) => permissionChangeHandler(e)}
            />

            <HandlerCheckbox
              checked={watched.permission[`isProduct`] || false}
              label="Manage Product"
              id="isProduct"
              onChange={(e) => permissionChangeHandler(e)}
            />

            <HandlerCheckbox
              checked={watched.permission[`isBuffet`] || false}
              label="Manage Buffet"
              id="isBuffet"
              onChange={(e) => permissionChangeHandler(e)}
            />

            <HandlerCheckbox
              checked={watched.permission[`isStaff`] || false}
              label="Manage Staff"
              id="isStaff"
              onChange={(e) => permissionChangeHandler(e)}
            />
          </div> */}
          {data !== undefined && <Archived register={register("archived")} />}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
