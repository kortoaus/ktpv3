"use client";

import React from "react";
import TimerIcon from "../icons/TimerIcon";
import { buffetTimerMsg, reloadPage } from "@/libs/util";
import { BuffetClass } from "@/types/model";
import { ReturnBuffetTimerDataProps } from "@/libs/useBuffetTimer";

type Props = {
  tableName: string;

  buffet?: BuffetClass;
  buffetTimer: ReturnBuffetTimerDataProps | null;
};

export default function SaleScreenHeader({
  tableName,
  buffet,
  buffetTimer,
}: Props) {
  return (
    <div className="HeaderContainer">
      <h2 onClick={() => reloadPage()}>Table #{tableName}</h2>
      <button
        className={`BasicBtn ${
          buffet ? "!border-0 bg-purple-500 text-white" : ""
        }`}
      >
        <TimerIcon />
        <span>{buffet?.name || "A la carte"}</span>
      </button>

      {buffetTimer && (
        <>
          <div className="text-blue-500 font-medium">
            {
              buffetTimerMsg(
                buffetTimer.phase,
                buffetTimer.orderRem,
                buffetTimer.stayRem
              ).kiosk
            }
          </div>
        </>
      )}
    </div>
  );
}
