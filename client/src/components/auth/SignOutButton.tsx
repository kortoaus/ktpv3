"use client";
import { signOut } from "@/libs/util";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DataLoading from "../ui/DataLoading";

type Props = {
  text?: string;
  className?: string;
};

export default function SignOutButton({
  text = "Sign Out",
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signOutHandler = () => {
    setLoading(true);
    signOut();
    setTimeout(() => {
      router.replace("/");
    }, 3000);
  };
  return (
    <button onClick={() => signOutHandler()} className={className}>
      {loading ? <DataLoading /> : text}
    </button>
  );
}
