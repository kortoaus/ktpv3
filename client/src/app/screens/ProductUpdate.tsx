"use client";
import IdSelectInput from "@/components/ui/form/IdSelectInput";
import ImgInput from "@/components/ui/form/ImgInput";
import PriceInput, { BuffetPriceInput } from "@/components/ui/form/PriceInput";
import TextInput from "@/components/ui/form/TextInput";
import ToggleCheckbox, {
  MultipleCheckbox,
} from "@/components/ui/form/ToggleCheckbox";
import { RequiredField } from "@/libs/Messages";
import { ProductOption } from "@/types/Product";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type BuffetPrice = {
  [key: number]: number;
};

type FormData = {
  name: string;
  categoryId: number;
  isBuffet: boolean;
  buffetIds: number[];
  price: number;
  buffetPrice: BuffetPrice;
};

type Props = {
  option: ProductOption;
};

export default function ProductUpdate({
  option: { categories, buffets },
}: Props) {
  const [imgFile, setImgFile] = useState<null | File>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      buffetIds: [],
      buffetPrice: {},
      isBuffet: true,
    },
  });

  const data = watch();
  console.log(data);

  const buffetIdHandler = (id: number) => {
    const prev = watch("buffetIds");
    let newVal: number[] = [];

    if (Boolean(prev.find((bId) => bId === id))) {
      newVal = [...prev.filter((bId) => bId !== id)];
    } else {
      newVal = [...prev, id];
    }
    setValue("buffetIds", newVal);
    return;
  };

  const buffetPriceHandler = (id: number, val: number) => {
    const prev = watch("buffetPrice");
    const newVal = {
      ...prev,
      [id]: val,
    };
    setValue("buffetPrice", newVal);
  };

  const updateHandler = (data: FormData) => {
    console.log(data);
    return;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <section className="grid grid-cols-3 gap-4 relative">
        <div className="col-span-2 border-r pr-4">
          <ImgInput
            label="Product Image"
            required
            val={imgFile}
            setVal={(val) => setImgFile(val)}
          />

          <form
            className="defaultForm mt-4"
            onSubmit={handleSubmit(updateHandler)}
          >
            <IdSelectInput
              label="Category"
              required
              placeholder="Select a category"
              register={register("categoryId", {
                required: RequiredField,
                setValueAs: (val) => Number(val),
              })}
              options={categories.map((opt) => ({
                name: opt.name,
                value: opt.id,
              }))}
              error={errors.categoryId}
              add={{
                label: "Add Category",
                href: "/category/new",
              }}
            />
            <TextInput
              label="Product Name"
              register={register("name", { required: RequiredField })}
              required
              error={errors.name}
            />
            <ToggleCheckbox
              id="isBuffet"
              label="Buffet Product"
              register={register("isBuffet", {
                setValueAs: (val) => Boolean(val),
              })}
            />
          </form>

          {/* Pricing */}
          {!data.isBuffet ? (
            <form
              className="defaultForm mt-4"
              onSubmit={handleSubmit(updateHandler)}
            >
              <PriceInput
                label={`Price(A La Carte)`}
                register={register("price", {
                  required: RequiredField,
                  setValueAs: (val) => Math.abs(Number(val)),
                })}
              />
            </form>
          ) : (
            <div className="defaultForm mt-4">
              {buffets.map((bf) => {
                return (
                  <div key={bf.id} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <MultipleCheckbox
                        id={bf.name}
                        label={bf.name}
                        checked={Boolean(
                          data.buffetIds.find((bId) => bId === bf.id)
                        )}
                        value={bf.id}
                        onChange={(val) => buffetIdHandler(val)}
                      />
                    </div>

                    {Boolean(data.buffetIds.find((bId) => +bId === bf.id)) && (
                      <BuffetPriceInput
                        value={data.buffetPrice[bf.id] || 0}
                        onChange={(val) => buffetPriceHandler(bf.id, val)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="relative">
          <div className="sticky top-0">
            <h3 className="mb-2">Preview</h3>
            <div className="border rounded-md overflow-hidden pb-4">
              {/* Img */}
              {imgFile ? (
                <div className="Uploaded relative">
                  <div className="SquareImg">
                    <Image
                      src={URL.createObjectURL(imgFile)}
                      width={1920}
                      height={1080}
                      alt="Image Uploaded"
                    />
                  </div>
                </div>
              ) : (
                <div className="SquareDiv">
                  <div className="absolute top-0 fccc w-full h-full">
                    No Image
                  </div>
                </div>
              )}
              {/* Info */}
              <div className="px-2">
                <span className="text-sm text-gray-500">
                  {categories.find((opt) => opt.id === data.categoryId)?.name ||
                    "Not Selected"}
                </span>
                <h4>{data.name ? data.name : "No Name"}</h4>

                <div className="text-right font-bold">
                  {data.isBuffet ? (
                    <span className="text-red-500">{`Buffet`}</span>
                  ) : (
                    <span>{`$${data.price.toFixed(2)}`}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
