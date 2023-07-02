"use client";
import BuffetPPForm, { BuffetDataType } from "@/components/BuffetPPForm";
import NumPad from "@/components/NumPad";
import DataLoading from "@/components/ui/DataLoading";
import useMutation from "@/libs/useMutation";
import { BuffetClass, Staff, Table } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  table: Table;
  staff: Staff;
  buffets: BuffetClass[];
};

const BuffetInit = {
  ppA: 0,
  ppB: 0,
  ppC: 0,
};

export default function OpenSale({ table, staff, buffets }: Props) {
  const router = useRouter();

  const [isBuffet, setIsBuffet] = useState(true);
  const [buffetData, setBuffetData] = useState<BuffetDataType>(BuffetInit);
  const [pp, setPP] = useState("");
  const [err, setErr] = useState("");

  const init = () => {
    setPP("");
    setErr("");
    setBuffetData(BuffetInit);
  };

  const [open, { loading, result }] = useMutation(`/api/table/${table.id}`);

  const openHandler = () => {
    setErr("");

    let openPP: number = +pp;

    const { id, ppA, ppB, ppC } = buffetData;
    if (isBuffet && !id) {
      setErr("Please select a buffet class!");
      return;
    }
    if (isBuffet) {
      openPP = ppA + ppB + ppC;
    }

    if (isNaN(openPP) || openPP < 1) {
      setErr("Please enter customers!");
      return;
    }

    const data = {
      staffId: staff.id,
      tableId: table.id,
      buffetData,
      pp: openPP,
    };

    open(data);
  };

  useEffect(() => {
    if (result) {
      if (result.ok && result.result) {
        router.replace("/");
      }

      if (result && !result.ok) {
        setErr(result.msg || "Failed Open Table!");
      }
    }
  }, [result, router]);

  const buffetClasses = buffets;

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      {loading ? (
        <DataLoading />
      ) : (
        <div className="p-4 w-full max-w-md">
          <Link prefetch={false} href="/">
            <button className="BasicBtn !border-0 bg-red-500 text-white mb-4">
              Go Back
            </button>
          </Link>
          <h1 className="mb-4">{`Open Table #${table.name}`}</h1>

          {/* Buffet Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => {
                init();
                setIsBuffet(false);
              }}
              className={`BasicBtn justify-center ${
                !isBuffet ? "bg-blue-500 text-white" : ""
              }`}
            >
              A la carte
            </button>
            <button
              onClick={() => {
                setPP("");
                setIsBuffet(true);
              }}
              className={`BasicBtn justify-center ${
                isBuffet ? "bg-blue-500 text-white" : ""
              }`}
            >
              Buffet
            </button>
          </div>

          {/* A la carte */}
          {!isBuffet && (
            <div>
              <h2 className="mb-2">Customers</h2>
              <div
                className="flex items-center justify-end px-4 border mb-4 py-2 "
                onClick={() => setPP("")}
              >
                <span className="text-lg font-medium mr-1">{`${Number(
                  pp
                )}`}</span>
                <span className="text-gray-500 text-sm">People</span>
              </div>
              <NumPad
                useDot={false}
                val={pp}
                setVal={(val) => {
                  if (!isBuffet) {
                    setPP(val);
                  }
                }}
              />
            </div>
          )}

          {/* Buffet */}
          {isBuffet && (
            <div>
              {/* Class Selector */}
              <h2 className="mb-2">Select Class</h2>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {buffetClasses.map((bfc) => (
                  <button
                    className={`BasicBtn ${
                      bfc.id === buffetData.id ? "text-white bg-blue-500" : ""
                    }`}
                    onClick={() =>
                      setBuffetData((prev) => ({ ...prev, id: bfc.id }))
                    }
                    key={bfc.id}
                  >
                    {bfc.name}
                  </button>
                ))}
              </div>

              {/* Counter */}
              {buffetData.id && (
                <>
                  <h2 className="mb-2">Customers</h2>
                  <BuffetPPForm
                    val={buffetData}
                    buffet={buffetClasses.find(
                      (bfc) => bfc.id === buffetData.id
                    )}
                    setVal={(val) => setBuffetData(val)}
                  />
                </>
              )}
            </div>
          )}

          <button
            onClick={() => openHandler()}
            className="BasicBtn bg-purple-500 text-white w-full !py-4 mt-4 justify-center text-2xl"
          >
            Open Table
          </button>
          {err && (
            <div className="text-red-500 text-center mt-4 font-medium">
              {err}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
