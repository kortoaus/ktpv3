"use client";

import DataLoading from "@/components/ui/DataLoading";
import useShift from "@/libs/useShift";
import useStaff from "@/libs/useUser";
import TitleScreen from "@/screens/TitleScreen";

// Auth, Shift, Product, Category, Buffet, Printer,

export default function TitlePage() {
  const { staff, staffLoading } = useStaff();
  const { shift, shiftLoading } = useShift();

  const loading = staffLoading || shiftLoading;
  return (
    <>
      {loading && (
        <div className="bg-gray-100/50 h-full">
          <DataLoading />
        </div>
      )}
      {!loading && <TitleScreen staff={staff} shift={shift} />}
    </>
  );
}
