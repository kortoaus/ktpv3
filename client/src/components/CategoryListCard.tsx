import { CategoryWithProductCount } from "@/types/Product";
import Link from "next/link";
import React from "react";

type Props = {
  data: CategoryWithProductCount;
};

export default function CategoryListCard({
  data: { id, name, index, productCount },
}: Props) {
  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-2 flex items-center justify-start text-sm">
        {index}
      </div>
      <div className="col-span-6 flex items-center justify-start font-medium">
        <Link href={`/category/${id}/product`} prefetch={false}>
          {name}
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/category/${id}/`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          Update
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/category/${id}/product`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          <span>{`${productCount} Prds`}</span>
        </Link>
      </div>
    </div>
  );
}
