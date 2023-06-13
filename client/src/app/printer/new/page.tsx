"use client";
import React from "react";
import PrinterUpdate from "@/screens/PrinterUpdate";

type Props = {
  searchParams: {
    page: string;
    keyword: number;
  };
};

export default function NewPrinterPage({ searchParams }: Props) {
  return (
    <main className="">
      <PrinterUpdate query={searchParams} />
    </main>
  );
}
