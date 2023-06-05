"use client";
import React, { useState } from "react";
import SignInForm from "./SignInForm";
import { useRouter } from "next/navigation";

export type SignInData = {
  phone: number;
  code: string;
};

type ResultProps = {
  ok: boolean;
  msg?: string;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInHandler = async (val: SignInData) => {
    setLoading(true);
    await fetch(`/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(val),
    })
      .then((res) => res.json())
      .then((data: ResultProps) => {
        if (data.ok) {
          router.push("/");
        } else {
          window.alert(data.msg || "Failed Sign In!");
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert("Failed Sign In!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full h-full fccc">
      {!loading && <SignInForm update={(val) => signInHandler(val)} />}
    </div>
  );
}
