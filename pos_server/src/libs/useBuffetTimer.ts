"use client";
import { BuffetClass } from "@/types/model";
import React, { useEffect, useState } from "react";
import { PhaseType, howOld } from "./util";

type Props = {
  buffet?: BuffetClass;
  started: Date | null;
};

type ReturnDataProps = {
  orderRem: number;
  stayRem: number;
  stay: number;
  phase: PhaseType;
};

export default function useBuffetTimer({ buffet, started }: Props) {
  const [data, setData] = useState<ReturnDataProps | null>(null);

  useEffect(() => {
    const getPhase = (stay: number): PhaseType => {
      if (buffet && started) {
        const { stayTime, orderTime } = buffet;

        const canOrder = stay < orderTime;
        const canStay = stay < stayTime;

        if (canOrder) {
          return "order";
        }

        if (canStay) {
          return "stay";
        }

        return "over";
      }

      return "order";
    };

    const getRemains = (stay: number) => {
      if (!buffet) {
        return {
          orderRem: 0,
          stayRem: 0,
        };
      }

      const { stayTime, orderTime } = buffet;
      return {
        orderRem: orderTime - stay,
        stayRem: stayTime - stay,
      };
    };

    const getData = () => {
      if (started && buffet) {
        const stay = howOld(started);
        const data = {
          stay,
          phase: getPhase(stay),
          ...getRemains(stay),
        };
        setData(data);
      }
    };

    const interval = setInterval(() => {
      getData();
    }, 3000);

    if (data === null) {
      getData();
    }

    return () => clearInterval(interval);
  }, [buffet, started, howOld, data]);

  return data;
}
