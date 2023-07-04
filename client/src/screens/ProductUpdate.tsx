"use client";
import ProductPreview from "@/components/ProductPreview";
import IdSelectInput from "@/components/ui/form/IdSelectInput";
import ImgInput from "@/components/ui/form/ImgInput";
import PriceInput, { BuffetPriceInput } from "@/components/ui/form/PriceInput";
import TextInput from "@/components/ui/form/TextInput";
import ToggleCheckbox, {
  MultipleCheckbox,
} from "@/components/ui/form/ToggleCheckbox";
import { BeDisabled, RequiredField, StillUpdating } from "@/libs/Messages";
import { ProductOption, ProductOptionGroup } from "@/types/Product";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ProductOptionDrawer from "./ProductOptionDrawer";
import TuneIcon from "@/components/icons/TuneIcon";
import { ProductOptionListCard } from "@/components/ProductOptionListCard";
import { uploadFile, urlToFile } from "@/libs/util";
import useMutation from "@/libs/useMutation";
import { Product } from "@/types/model";
import { ApiResultType } from "@/types/api";
import { useRouter } from "next/navigation";
import Archived from "@/components/ui/form/Archived";
import Link from "next/link";

type BuffetPrice = {
  [key: number]: number;
};

type FormData = {
  imgId: null | string;
  name: string;
  categoryId: number;
  isBuffet: boolean;
  buffetIds: number[];
  printerIds: number[];
  price: number;
  buffetPrice: BuffetPrice;
  options: ProductOptionGroup[];
  hideKiosk: boolean;
  outOfStock: boolean;
  archived: boolean;
};

type Props = {
  data?: Product | undefined;
  option: ProductOption;
  query: {
    keyword: number;
    page: string;
  };
};

export default function ProductUpdate({
  data,
  option: { categories, buffets, printers },
  query,
}: Props) {
  const [imgFile, setImgFile] = useState<null | File>(null);
  const [isOptionDrawerOpen, setIsOptionDrawerOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      buffetIds: [],
      printerIds: [],
      buffetPrice: {},
      isBuffet: false,
      options: [],
    },
  });

  const formData = watch();

  const MultipleHandler = (
    id: number,
    taregt: "buffetIds" | "printerIds" = "buffetIds"
  ) => {
    const prev = watch(taregt);

    if (!prev) {
      return;
    }
    let newVal: number[] = [];

    if (Boolean(prev.find((bId) => bId === id))) {
      newVal = [...prev.filter((bId) => bId !== id)];
    } else {
      newVal = [...prev, id];
    }
    setValue(taregt, newVal);
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

  const [update, { result, loading }] = useMutation<ApiResultType>(
    `/api/product${data ? `/${data.id}` : ""}`
  );

  const updateHandler = async (data: FormData) => {
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

    // Validate
    const { categoryId, isBuffet, buffetIds } = data;

    if (!Boolean(categoryId)) {
      const msg = `Please select a category`;
      window.alert(msg);
      return;
    }

    if (isBuffet && buffetIds.length === 0) {
      const msg = `Please select at least one class.`;
      window.alert(msg);
      return;
    }

    let imgId = data.imgId;

    if (imgFile && imgId === null) {
      const { ok, id: rImgId }: { ok: boolean; id: string | null } =
        await uploadFile(imgFile);
      if (ok && rImgId) {
        imgId = rImgId;
      }
    }

    const sanitized = {
      ...data,
      imgId,
      options: JSON.stringify(data.options),
      buffetIds: JSON.stringify(data.buffetIds),
      buffetPrice: JSON.stringify(data.buffetPrice),
      printerIds: JSON.stringify(data.printerIds),
    };

    // OK

    update({ ...sanitized });
    return;
  };

  // Update Response
  useEffect(() => {
    if (result && result.ok) {
      router.push(
        `/product?page=${query.page || 1}&keyword=${query.keyword || ""}`
      );
    }

    if (result && !result.ok) {
      window.alert(result.msg || "Failed Update!");
    }
  }, [result, router, query]);

  // Load Previous
  useEffect(() => {
    const getImg = async (imgId: string) => {
      const image = await urlToFile(`http://localhost:3000/imgs/${imgId}`);

      if (image) {
        setImgFile(image);
      }
    };

    if (data) {
      const {
        categoryId,
        name,
        price,
        isBuffet,
        buffetIds,
        buffetPrice,
        printerIds,
        options,
        hideKiosk,
        archived,
        imgId,
        outOfStock,
      } = data;

      if (categoryId) {
        setValue("categoryId", categoryId);
      }
      if (outOfStock) {
        setValue("outOfStock", outOfStock);
      }

      if (name) {
        setValue("name", name);
      }
      if (isBuffet) {
        setValue("isBuffet", isBuffet);
      }
      if (price) {
        setValue("price", price);
      } else {
        setValue("price", 0);
      }

      if (buffetIds) {
        setValue("buffetIds", JSON.parse(buffetIds));
      }
      if (buffetPrice) {
        setValue("buffetPrice", JSON.parse(buffetPrice));
      }
      if (printerIds) {
        setValue("printerIds", JSON.parse(printerIds));
      }
      if (options) {
        setValue("options", JSON.parse(options));
      }
      if (hideKiosk) {
        setValue("hideKiosk", hideKiosk);
      }
      if (archived) {
        setValue("archived", archived);
      }

      if (imgId) {
        getImg(imgId);
      }
    }
  }, [data, setValue]);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href={`/product?page=${query.page || 1}&keyword=${
            query.keyword || ""
          }`}
          prefetch
        >
          <button className="BasicBtn mb-2">Go Back To List</button>
        </Link>
        <h1 className="mb-2 border-b pb-2">Update Product</h1>
        <section className="grid grid-cols-3 gap-4 relative">
          <div className="col-span-2 border-r pr-4 pt-8">
            <ImgInput
              label="Product Image"
              required
              val={imgFile}
              setVal={(val) => {
                // setValue("imgId", null);
                // setImgFile(val);
              }}
            />

            {/* Category and Name */}
            <form
              className="defaultForm mt-4"
              onSubmit={handleSubmit(updateHandler)}
            >
              <IdSelectInput
                disabled
                label="Category"
                required
                placeholder="Select a category"
                register={register("categoryId", {
                  required: RequiredField,
                  setValueAs: (val) => Number(val),
                  validate: (val) => {
                    if (!val || !Boolean(val)) {
                      return `Please select a category`;
                    }
                  },
                })}
                options={categories.map((opt) => ({
                  name: opt.name,
                  value: opt.id,
                }))}
                error={errors.categoryId}
              />
              <TextInput
                label="Product Name"
                register={register("name", { required: RequiredField })}
                required
                error={errors.name}
                disabled
              />
              <ToggleCheckbox
                disabled
                id="isBuffet"
                label="Buffet Product"
                register={register("isBuffet", {
                  setValueAs: (val) => {
                    if (val && !formData.price) {
                      setValue("price", 0);
                    }
                    return Boolean(val);
                  },
                })}
              />
            </form>
            {/* Pricing */}
            {!formData.isBuffet ? (
              <form
                className="defaultForm mt-4"
                onSubmit={handleSubmit(updateHandler)}
              ></form>
            ) : (
              <div className="defaultForm mt-4">
                <h3>Buffet Classes</h3>
                {buffets.map((bf) => {
                  return (
                    <div key={bf.id} className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <MultipleCheckbox
                          disabled
                          id={bf.name}
                          label={bf.name}
                          checked={Boolean(
                            formData.buffetIds.find((bId) => bId === bf.id)
                          )}
                          value={bf.id}
                          onChange={(val) => MultipleHandler(val)}
                        />
                      </div>

                      {Boolean(
                        formData.buffetIds.find((bId) => +bId === bf.id)
                      ) && (
                        <BuffetPriceInput
                          value={formData.buffetPrice[bf.id] || 0}
                          onChange={(val) => buffetPriceHandler(bf.id, val)}
                          disabled
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Options */}
            {formData.options.length !== 0 && (
              <div className="defaultForm mt-4">
                <h3>Options</h3>
                {/* <button
                onClick={() => setIsOptionDrawerOpen(true)}
                className="BasicBtn justify-center"
              >
                <TuneIcon size={24} />
                <span>Open Option Editor</span>
              </button> */}

                {formData.options.map((opt) => {
                  return <ProductOptionListCard data={opt} key={opt.id} />;
                })}
              </div>
            )}

            {/* Printers */}
            <div className="defaultForm mt-4">
              <h3>Printers</h3>
              <div className="grid grid-cols-2 gap-2">
                {printers.map((pt) => (
                  <MultipleCheckbox
                    key={pt.id}
                    id={pt.label}
                    label={pt.label}
                    checked={Boolean(
                      formData.printerIds.find((bId) => bId === pt.id)
                    )}
                    value={pt.id}
                    onChange={(val) => MultipleHandler(val, "printerIds")}
                  />
                ))}
              </div>
            </div>

            <form
              className="defaultForm mt-4"
              onSubmit={handleSubmit(updateHandler)}
            >
              <h4>Misc Options</h4>
              <ToggleCheckbox
                id="hide_kiosk"
                label="Hide on customer's screens"
                register={register("hideKiosk", {
                  setValueAs: (val) => Boolean(val),
                })}
                disabled
              />
              <ToggleCheckbox
                id="outofstock"
                label="Out Of Stock"
                register={register("outOfStock", {
                  setValueAs: (val) => Boolean(val),
                })}
              />

              {data !== undefined && (
                <Archived register={register("archived")} />
              )}

              <button>Submit</button>
            </form>
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="sticky top-0">
              <h3 className="mb-2">Preview</h3>
              <ProductPreview
                img={imgFile ? URL.createObjectURL(imgFile) : undefined}
                category={
                  formData.categoryId
                    ? categories.find((ct) => ct.id === formData.categoryId)
                        ?.name
                    : undefined
                }
                name={formData.name}
                isBuffet={formData.isBuffet}
                price={formData.price}
              />
            </div>
          </div>
        </section>
      </div>
      <ProductOptionDrawer
        val={formData.options}
        setValue={(val) => setValue("options", val)}
        open={isOptionDrawerOpen}
        onClose={() => setIsOptionDrawerOpen(false)}
      />
    </>
  );
}
