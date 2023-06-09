"use client";
import DataLoading from "@/components/ui/DataLoading";
import useShift from "@/libs/useShift";
import useStaff from "@/libs/useUser";
import getRole from "@/libs/util";
import ShiftOpen from "@/screens/ShiftOpen";
import { ApiResultType } from "@/types/api";
import { Product } from "@/types/model";
import React from "react";
import useSWR from "swr";

type ResultProps = ApiResultType & {
  result: Product[];
};

export default function ShiftOpenPage() {
  const { shift, shiftLoading } = useShift();
  const { staff, staffLoading } = useStaff();
  const { data, isLoading } = useSWR<ResultProps>("/api/product/oos");

  const loading = shiftLoading || staffLoading || isLoading;

  return (
    <>
      {loading ? (
        <DataLoading />
      ) : (
        <>
          {staff && data && getRole(staff, "isOpen") ? (
            <>
              {shift && <div>Already Opened</div>}
              {shift === null && <ShiftOpen oos={data ? data.result : []} />}
            </>
          ) : (
            <div>You do not have permission!</div>
          )}
        </>
      )}
    </>
  );
}
