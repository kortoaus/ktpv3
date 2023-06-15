"use client";
import DataLoading from "@/components/ui/DataLoading";
import useShift from "@/libs/useShift";
import useStaff from "@/libs/useUser";
import getRole from "@/libs/util";
import ShiftOpen from "@/screens/ShiftOpen";
import React from "react";

export default function ShiftOpenPage() {
  const { shift, shiftLoading } = useShift();
  const { staff, staffLoading } = useStaff();

  const loading = shiftLoading || staffLoading;

  return (
    <>
      {loading ? (
        <DataLoading />
      ) : (
        <>
          {staff && getRole(staff, "isOpen") ? (
            <>
              {shift && <div>Already Opened</div>}
              {shift === null && <ShiftOpen />}
            </>
          ) : (
            <div>You do not have permission!</div>
          )}
        </>
      )}
    </>
  );
}
