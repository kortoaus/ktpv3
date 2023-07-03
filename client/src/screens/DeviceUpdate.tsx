"use client";
import SelectTableDrawer from "@/components/SelectTableDrawer";
import TableIcon from "@/components/icons/TableIcon";
import DataLoading from "@/components/ui/DataLoading";
import Archived from "@/components/ui/form/Archived";
import { StrSelectInput } from "@/components/ui/form/IdSelectInput";
import TextInput from "@/components/ui/form/TextInput";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { isIP } from "@/libs/util";
import { TableContainerWithTables } from "@/types/Table";
import { ApiResultType } from "@/types/api";
import { Device } from "@/types/model";
import Link from "next/link";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: Device;
  query: {
    keyword: number;
    page: string;
  };
  tables: TableContainerWithTables[];
};

type FormDataProps = {
  id?: number;
  name: string;
  type: string;
  ip: string;
  archived: boolean;
  tableId?: number;
};

const initValue: FormDataProps = {
  name: "",
  type: "TABLE",
  archived: false,
  ip: "",
};

export default function DeviceUpdate({ data, query, tables }: Props) {
  const [isTable, setIsTable] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormDataProps>({
    defaultValues: data
      ? {
          ...data,
          tableId: data.tableId ? data.tableId : undefined,
          ip: data.ip ? data.ip : "",
        }
      : {
          ...initValue,
        },
  });

  const [update, { result, loading }] = useMutation<ApiResultType>(
    `/api/device${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(
        `/device?page=${query.page || 1}&keyword=${query.keyword || ""}`
      );
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, router, query]);

  const updateHandler = (form: FormDataProps) => {
    if (loading) {
      window.alert(StillUpdating);
      return;
    }

    if (Boolean(form.archived)) {
      const msg = `${form.name} ${BeDisabled}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    if (form.type === "TABLE" && !Boolean(form.tableId)) {
      const msg = `Please Select a table of the device.`;
      window.alert(msg);
      return;
    }

    update({
      ...form,
      tableId: form.type === "POS" ? undefined : form.tableId,
    });
  };

  const watched = watch();

  const getContainer = () => {
    if (!watched.tableId) {
      return "Not Selected";
    }

    const exId = tables.findIndex((ct) => {
      return ct.tables.find((tb) => tb.id === watched.tableId);
    });

    if (exId === -1) {
      return "Not Selected";
    }

    const container = tables[exId];
    const table = tables[exId].tables.find((tb) => tb.id === watched.tableId);

    if (table) {
      return `${container.name} / ${table.name}`;
    }

    return "Not Selected";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link
        href={`/device?page=${query.page || 1}&keyword=${query.keyword || ""}`}
        prefetch={false}
      >
        <button className="BasicBtn mb-2">Go Back To List</button>
      </Link>
      <h1 className="mb-2 border-b pb-2">Update Device</h1>

      {loading ? (
        <DataLoading />
      ) : (
        <>
          <form className="defaultForm" onSubmit={handleSubmit(updateHandler)}>
            <TextInput
              label="Device Name"
              required
              register={register("name", { required: RequiredField })}
              placeholder="eg. New Device"
              error={errors.name}
            />

            <TextInput
              label="IP Address"
              required
              register={register("ip", {
                required: RequiredField,
                validate: (val) => {
                  if (val && !isIP(val)) {
                    return "Invalid IP Address!";
                  }
                },
              })}
              placeholder="eg. 192.168.1.1"
              error={errors.ip}
            />

            <StrSelectInput
              label="Device Type"
              required
              register={register("type", { required: RequiredField })}
              options={[
                { name: "POS", value: "POS" },
                { name: "TABLE", value: "TABLE" },
              ]}
              error={errors.type}
            />
          </form>

          {watched.type === "TABLE" && (
            <div className="mt-4 defaultForm">
              <button
                className="w-full BasicBtn border-blue-500 !bg-blue-500 text-white justify-center"
                onClick={() => setIsTable(true)}
              >
                <TableIcon />{" "}
                {watched.tableId ? (
                  <span>{getContainer()}</span>
                ) : (
                  <span>Select Table</span>
                )}
              </button>
              <SelectTableDrawer
                open={isTable}
                onClose={() => setIsTable(false)}
                setVal={(val) => setValue("tableId", val)}
                tables={tables}
                val={watched.tableId}
              />
            </div>
          )}

          <form
            className="defaultForm mt-4"
            onSubmit={handleSubmit(updateHandler)}
          >
            {data !== undefined && <Archived register={register("archived")} />}

            <button>Update</button>
          </form>
        </>
      )}
    </div>
  );
}
