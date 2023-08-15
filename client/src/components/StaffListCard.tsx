import { Staff } from "@/types/model";
import Link from "next/link";
import React from "react";
import { PagingProps } from "@/types/api";
import { StaffRole } from "@/types/Staff";

type Props = {
  data: Staff;
  paging: PagingProps;
};

export default function StaffListCard({
  data: { id, name, permission },
  paging,
}: Props) {
  const { current, keyword } = paging;

  const keyParser = (permission: string) => {
    let parsed: string[] = [];
    try {
      const roles: StaffRole = JSON.parse(permission);
      for (const k in roles) {
        if (roles[k]) {
          parsed.push(`${k.replace("is", "")}`);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      return parsed;
    }
  };

  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-10 flex items-center justify-start">
        <Link
          href={`/staff/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="font-medium">{name}</div>
          {/* <div className="text-xs flex items-center flex-wrap gap-2 mt-1">
            {keyParser(permission).map((role, idx) => (
              <span
                className="bg-blue-500 text-white px-2 rounded-md"
                key={idx}
              >
                {role}
              </span>
            ))}
          </div> */}
        </Link>
      </div>
      <div className="col-span-2 fccc text-blue-500">
        <Link
          href={`/staff/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          Update
        </Link>
      </div>
    </div>
  );
}
