"use client";
import React from "react";
import StaffUpdate from "@/screens/StaffUpdate";

type Props = {
  searchParams: {
    page: string;
    keyword: number;
  };
};

export default function NewPrinterPage({ searchParams }: Props) {
  return (
    <main className="">
      <StaffUpdate query={searchParams} />
    </main>
  );
}
