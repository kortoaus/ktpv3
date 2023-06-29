import Link from "next/link";
import React from "react";
import HomeIcon from "../icons/HomeIcon";
import TimerIcon from "../icons/TimerIcon";
import { buffetTimerMsg } from "@/libs/util";
import { BuffetClass } from "@/types/model";
import { ReturnBuffetTimerDataProps } from "@/libs/useBuffetTimer";

type Props = {
  tableName: string;
  openBuffet: (val: boolean) => void;
  openTimer: (val: boolean) => void;
  buffet?: BuffetClass;
  buffetTimer: ReturnBuffetTimerDataProps | null;
};

export default function SaleScreenHeader({
  tableName,
  openBuffet,
  buffet,
  buffetTimer,
  openTimer,
}: Props) {
  return (
    <div className="HeaderContainer">
      <Link href="/" prefetch={false} className="fccc">
        <button className="HomeBtn">
          <HomeIcon />
        </button>
      </Link>
      <h2>Table #{tableName}</h2>
      <div className="h-full border-r"></div>
      <button
        onClick={() => openBuffet(true)}
        className={`BasicBtn ${
          buffet ? "!border-0 bg-purple-500 text-white" : ""
        }`}
      >
        <TimerIcon />
        <span>{buffet?.name || "A la carte"}</span>
      </button>

      {buffetTimer && (
        <>
          <div className="text-red-500 font-medium">
            {
              buffetTimerMsg(
                buffetTimer.phase,
                buffetTimer.orderRem,
                buffetTimer.stayRem
              ).pos
            }
          </div>
          <button
            className="bg-purple-500 text-white text-2xl p-2 rounded-md"
            onClick={() => openTimer(true)}
          >
            <TimerIcon size={24} />
          </button>
        </>
      )}
      <div className="h-full border-r"></div>
    </div>
  );
}
