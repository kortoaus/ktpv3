"use client";

import DataLoading from "@/components/ui/DataLoading";
import useShift from "@/libs/useShift";
import useStaff from "@/libs/useUser";
import TitleScreen from "@/screens/TitleScreen";

export default function TitlePage() {
  const { staff, staffLoading } = useStaff();
  const { shift, sales, shiftLoading } = useShift();
  const loading = staffLoading || shiftLoading;

  return (
    <>
      {loading && (
        <div className="bg-gray-100/50 h-full">
          <DataLoading />
        </div>
      )}
      {!loading && (
        <TitleScreen sales={sales ? sales : []} staff={staff} shift={shift} />
      )}
    </>
  );
}
