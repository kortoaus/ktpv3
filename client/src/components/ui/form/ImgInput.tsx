"use client";
import React, { useRef } from "react";
import Required from "./Required";
import Image from "next/image";
import DeleteIcon from "@/components/icons/DeleteIcon";

type Props = {
  label?: string;
  required?: Boolean;
  val: null | File;
  setVal: (val: null | File) => void;
};

export default function ImgInput({
  label = "Image",
  required = false,
  val,
  setVal,
}: Props) {
  const setValHandler = (img: File) => {
    setVal(img);
  };

  const input = useRef<HTMLInputElement>(null);

  const openFinderHandler = () => {
    if (input && input.current) {
      input.current.click();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="defaultForm ImgUploadInput"
    >
      <div className="form-element-group">
        <label className="" htmlFor="ImgInputElem">
          <span>{label}</span>
          {required && <Required />}
        </label>
        {val === null ? (
          <>
            <input
              ref={input}
              id="ImgInputElem"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setValHandler(e.target.files[0]);
                }
              }}
            />
            <div
              className="SquareDiv border rounded-md overflow-hidden hover:cursor-pointer"
              onClick={() => openFinderHandler()}
            >
              <div className="absolute top-0 fccc w-full h-full text-blue-500 font-medium">
                Select Image
              </div>
            </div>
          </>
        ) : (
          <div onClick={() => setVal(null)} className="Uploaded relative">
            <div className="SquareImg">
              <Image
                src={URL.createObjectURL(val)}
                width={1920}
                height={1080}
                alt="Image Uploaded"
              />
            </div>
            {/* <div className="w-full h-full absolute top-0 opacity-0 hover:opacity-100 cursor-pointer">
              <div className="bg-red-500/25 text-white fccc w-full h-full">
                <DeleteIcon size={64} />
                <p className="font-medium mt-1 text-lg">Remove</p>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </form>
  );
}
