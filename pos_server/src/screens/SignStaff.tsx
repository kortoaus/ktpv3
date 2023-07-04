"use client";

import NumPad from "@/components/NumPad";
import SignInIcon from "@/components/icons/SignInIcon";
import useMutation from "@/libs/useMutation";
import { Staff } from "@/types/model";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  signIn: (val: Staff) => void;
};

export default function SignStaff({ signIn }: Props) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const [auth, { result, loading }] = useMutation<{
    ok: boolean;
    msg?: string;
    result: Staff | null;
  }>(`/api/staff`, "POST");

  const authHandler = () => {
    if (loading) {
      return;
    }

    setErr("");

    if (code.length === 0) {
      setErr("Please enter your code!");
      return;
    }

    auth({ code });
  };

  useEffect(() => {
    if (result) {
      if (result.ok && result.result) {
        signIn(result.result);
      }

      if (result && !result.ok) {
        setErr(result.msg || "Failed Sign In!");
      }
    }
  }, [result, signIn]);

  return (
    <div className="w-full h-screen fccc">
      <div className="w-full max-w-sm">
        <Link prefetch={false} href="/">
          <button className="BasicBtn !border-0 bg-red-500 text-white mb-4">
            Go Back
          </button>
        </Link>
        <h1>Sign In</h1>
        <div
          onClick={() => setCode("")}
          className="w-full my-4 fccc h-14 border px-4 text-xl"
        >
          {code
            .split("")
            .map((_) => "*")
            .join("")}
        </div>
        <NumPad
          val={code}
          setVal={(val) => {
            if (loading) {
              return;
            }
            setErr("");
            setCode(val);
          }}
          useDot={false}
        />
        {!loading && (
          <button
            onClick={() => authHandler()}
            className="BasicBtn mt-4 w-full justify-center !py-4 bg-green-500 text-white !border-0"
          >
            <span className="text-xl font-medium">Sign In</span>
            <SignInIcon size={24} />
          </button>
        )}
        {err && (
          <div className="text-red-500 text-center mt-4 font-medium">{err}</div>
        )}
      </div>
    </div>
  );
}
