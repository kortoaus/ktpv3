"use client";
import { isMobile } from "@/libs/util";
import React, { useState } from "react";
import NumPad from "../NumPad";
import { SignInData } from "./SignIn";

type Props = {
  update: (data: SignInData) => void;
};

type formData = {
  phone: string;
  code: string;
};

const initData = {
  phone: "",
  code: "",
};

export default function SignInForm({ update }: Props) {
  const [err, setErr] = useState("");
  const [target, setTarget] = useState<"phone" | "code">("phone");
  const [data, setData] = useState<formData>(initData);

  const updateHandler = () => {
    setErr("");
    const { phone, code } = data;
    if (!phone || !code) {
      setErr("Please enter phone and code!");
      return;
    }

    if (!isMobile(phone)) {
      setErr("Invalid mobile format!");
    }

    update({
      phone: Number(phone),
      code,
    });
    setData(initData);
  };

  const onChangeHandler = (val: string) => {
    setErr("");
    setData((prev) => {
      if (target === "phone") {
        return {
          ...prev,
          phone: val,
        };
      } else {
        return {
          ...prev,
          code: val,
        };
      }
    });
  };

  return (
    <div className="w-full max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateHandler();
        }}
        className="defaultForm"
      >
        <div
          className="form-element-group"
          onClick={() => {
            if (target === "phone") {
              onChangeHandler("");
            } else {
              setTarget("phone");
            }
          }}
        >
          <label>Mobile</label>
          <input
            type="text"
            disabled
            value={data.phone}
            className={` ${target === "phone" ? "actived" : ""}`}
          />
        </div>

        <div
          className="form-element-group"
          onClick={() => {
            if (target === "code") {
              onChangeHandler("");
            } else {
              setTarget("code");
            }
          }}
        >
          <label>Code</label>
          <input
            type="password"
            disabled
            value={data.code}
            className={` ${target === "code" ? "actived" : ""}`}
          />
        </div>

        <button>Sign In</button>
      </form>
      {err && (
        <p className="my-2 text-center text-red-500 font-medium">{err}</p>
      )}
      <div className="mt-4">
        <NumPad
          val={data[target]}
          setVal={(val) => onChangeHandler(val)}
          useDot={false}
        />
      </div>
    </div>
  );
}
