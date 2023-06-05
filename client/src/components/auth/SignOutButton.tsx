"use client";
import { signOut } from "@/libs/util";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  text?: string;
  className?: string;
};

export default function SignOutButton({
  text = "Sign Out",
  className = "",
}: Props) {
  const router = useRouter();
  const signOutHandler = () => {
    signOut();
    router.replace("/auth");
  };
  return (
    <button onClick={() => signOutHandler()} className={className}>
      {text}
    </button>
  );
}
