import Image from "next/image";
import React from "react";

type Props = {
  img?: string;
  category?: string;
  name?: string;
  isBuffet: boolean;
  price?: number;
};

export default function ProductPreview({
  img,
  category,
  name,
  isBuffet,
  price,
}: Props) {
  return (
    <div className="border rounded-md overflow-hidden pb-4">
      {/* Img */}
      {img ? (
        <div className="Uploaded relative">
          <div className="SquareImg">
            <Image src={img} width={1920} height={1080} alt="Image Uploaded" />
          </div>
        </div>
      ) : (
        <div className="SquareDiv">
          <div className="absolute top-0 fccc w-full h-full">No Image</div>
        </div>
      )}
      {/* Info */}
      <div className="px-2">
        <span className="text-sm text-gray-500">
          {category || "Not Selected"}
        </span>
        <h4>{name || "No Name"}</h4>

        <div className="text-right font-medium">
          {isBuffet ? (
            <span className="text-red-500">{`Buffet`}</span>
          ) : (
            <span>{`$${price?.toFixed(2) || "0"}`}</span>
          )}
        </div>
      </div>
    </div>
  );
}
