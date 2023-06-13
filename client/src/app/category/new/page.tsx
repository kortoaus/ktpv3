import CategoryUpdate from "@/screens/CategoryUpdate";
import React from "react";

type Props = {
  searchParams: {
    page: string;
    keyword: number;
  };
};

export default function NewCategoryPage({ searchParams }: Props) {
  return (
    <main className="">
      <CategoryUpdate query={searchParams} />
    </main>
  );
}
