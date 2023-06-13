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
  data: { id, name, imgId },
  paging,
}: Props) {
  const { current, keyword } = paging;
  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-2">
        {imgId && (
          <Image
            alt={name}
            src={`http://localhost:3000/imgs/${imgId}`}
            width={256}
            height={256}
          />
        )}
      </div>
      <div className="col-span-8 flex items-center justify-start font-medium">
        <Link
          href={`/product/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          {name}
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/product/${id}?page=${current}&keyword=${keyword}/`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          Update
        </Link>
      </div>
    </div>
  );
}
