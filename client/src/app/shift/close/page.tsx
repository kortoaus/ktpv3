"use client";
import DataLoading from "@/components/ui/DataLoading";
import useShift from "@/libs/useShift";
import useStaff from "@/libs/useUser";
import getRole from "@/libs/util";
import ShiftClose from "@/screens/ShiftClose";
import React from "react";

export default function ShiftOpenPage() {
  const { shift, sales, shiftResult, shiftLoading } = useShift();
  const { staff, staffLoading } = useStaff();

  const loading = shiftLoading || staffLoading;

  const sl = sales ? sales : [];

  const goodtogo =
    shift !== null && shift !== undefined && sl.length == 0 && shiftResult;

  return (
    <>
      {loading ? (
        <DataLoading />
      ) : (
        <>
          {staff && getRole(staff, "isOpen") ? (
            <>
              {!goodtogo && <div>Can not close shift.</div>}
              {goodtogo && (
                <ShiftClose shift={shift} shiftResult={shiftResult} />
              )}
            </>
          ) : (
            <div>You do not have permission!</div>
          )}
        </>
      )}
    </>
  );
}
