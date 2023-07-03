"use client";
import DataLoading from "@/components/ui/DataLoading";
import Archived from "@/components/ui/form/Archived";
import IntInput from "@/components/ui/form/IntInput";
import PriceInput from "@/components/ui/form/PriceInput";
import TextInput from "@/components/ui/form/TextInput";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import useMutation from "@/libs/useMutation";
import { ApiResultType } from "@/types/api";
import { BuffetClass } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  data?: BuffetClass;
};

type FormDataProps = {
  id?: number;
  mId?: number | null;
  name: string;
  priceA: number;
  priceB: number;
  priceC: number;
  h_priceA: number;
  h_priceB: number;
  h_priceC: number;
  nameA: string;
  nameB: string;
  nameC: string;
  stayTime: number;
  orderTime: number;
  archived: boolean;
};

const initValue: FormDataProps = {
  name: "",
  priceA: 0,
  priceB: 0,
  priceC: 0,
  h_priceA: 0,
  h_priceB: 0,
  h_priceC: 0,
  nameA: "Adults",
  nameB: "Students",
  nameC: "Kids",
  stayTime: 90,
  orderTime: 60,
  archived: false,
};

export default function BuffetUpdate({ data }: Props) {
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
    `/api/buffet${data ? `/${data.id}` : ""}`
  );

  useEffect(() => {
    if (result && result.ok) {
      router.push(`/buffet`);
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
      const msg = `${data.name} ${BeDisabled}`;
      if (!window.confirm(msg)) {
        return;
      }
    }

    // sanitize
    const {
      priceA,
      priceB,
      priceC,
      h_priceA,
      h_priceB,
      h_priceC,
      nameA,
      stayTime,
      orderTime,
    } = data;

    const sanitized = {
      ...data,
      priceA: Math.abs(Number(priceA)),
      priceB: Math.abs(Number(priceB)),
      priceC: Math.abs(Number(priceC)),
      h_priceA: Math.abs(Number(h_priceA)),
      h_priceB: Math.abs(Number(h_priceB)),
      h_priceC: Math.abs(Number(h_priceC)),
      stayTime: Math.abs(Number(stayTime)),
      orderTime: Math.abs(Number(orderTime)),
    };

    update(sanitized);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link href={`/buffet`} prefetch={false}>
        <button className="BasicBtn mb-2">Go Back To List</button>
      </Link>
      <h1 className="mb-2 border-b pb-2">Update Buffet</h1>

      {loading ? (
        <DataLoading />
      ) : (
        <form className="defaultForm" onSubmit={handleSubmit(updateHandler)}>
          {/* Name */}

          <TextInput
            label={"Class Name"}
            register={register("name", { required: RequiredField })}
            placeholder="eg. Standard Buffet"
            required
            error={errors.name}
          />

          {/* Pricing */}
          <section className="flex flex-col gap-4 border-y py-4">
            {/* Price A */}
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label={`Price Name(A)`}
                register={register("nameA", { required: RequiredField })}
                required
                placeholder="eg. Adults"
                error={errors.nameA}
              />

              <PriceInput
                label={`Price(A)`}
                required
                register={register("priceA", { required: RequiredField })}
                error={errors.priceA}
              />

              <PriceInput
                label={`Price(A) / Holiday`}
                required
                register={register("h_priceA", { required: RequiredField })}
                error={errors.h_priceA}
              />
            </div>
            {/* Price B */}
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label={`Price Name(B)`}
                register={register("nameB", { required: RequiredField })}
                required
                placeholder="eg. Students"
                error={errors.nameB}
              />

              <PriceInput
                label={`Price(B)`}
                required
                register={register("priceB", { required: RequiredField })}
                error={errors.priceB}
              />

              <PriceInput
                label={`Price(B) / Holiday`}
                required
                register={register("h_priceB", { required: RequiredField })}
                error={errors.h_priceB}
              />
            </div>
            {/* Price B */}
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label={`Price Name(C)`}
                register={register("nameC", { required: RequiredField })}
                required
                placeholder="eg. Kids"
                error={errors.nameC}
              />

              <PriceInput
                label={`Price(C)`}
                required
                register={register("priceC", { required: RequiredField })}
                error={errors.priceC}
              />

              <PriceInput
                label={`Price(C) / Holiday`}
                required
                register={register("h_priceC", { required: RequiredField })}
                error={errors.h_priceC}
              />
            </div>
          </section>

          <IntInput
            label={`Order Time(Mins)`}
            register={register("orderTime", { required: RequiredField })}
            error={errors.orderTime}
            required
          />

          <IntInput
            label={`Stay Time(Mins)`}
            register={register("stayTime", { required: RequiredField })}
            error={errors.stayTime}
            required
          />

          {data !== undefined && (
            <Archived label="Disabled" register={register("archived")} />
          )}

          <button>Update</button>
        </form>
      )}
    </div>
  );
}
