import { PagingProps } from "@/types/api";
import { Product } from "@/types/model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  data: Product;
  paging: PagingProps;
};

export default function ProductListCard({
  data: {
    id,
    name,
    imgId,
    archived,
    isBuffet,
    printerIds,
    buffetIds,
    buffetPrice,
  },
  paging,
}: Props) {
  const { current, keyword } = paging;
  return (
    <div
      className={`grid grid-cols-12 border-b py-4 gap-2 ${
        archived ? "opacity-50" : ""
      }`}
    >
      <div className="col-span-1 SquareImg">
        {imgId && (
          <Image
            alt={name}
            src={`http://localhost:3000/imgs/${imgId}`}
            width={256}
            height={256}
          />
        )}
      </div>
      <div className="col-span-9 flex items-center justify-start font-medium">
        <Link
          href={`/product/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div>
            {isBuffet && (
              <span className="mr-1 text-red-500">{`[Buffet]`}</span>
            )}
            <span>{name}</span>
          </div>

          <div className="text-sm text-gray-500">{printerIds}</div>
          <div className="text-sm text-gray-500">{buffetPrice}</div>
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/product/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          Update
        </Link>
      </div>
    </div>
  );
}
