import { ApiResultType } from "@/types/api";
import React from "react";
import DollarIcon from "./icons/DollarIcon";

export default function KickDrawerBtn() {
  const handler = async () => {
    const result: ApiResultType = await fetch(`/api/device/kd`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => data);

    if (!result.ok) {
      window.alert(result.msg || "Failed Kick Drawer!");
    }
  };

  return (
    <button
      className="fixed bottom-8 right-8 w-16 h-16 bg-green-500 text-white fccc rounded-full"
      onClick={() => handler()}
    >
      <DollarIcon size={48} />
    </button>
  );
}
