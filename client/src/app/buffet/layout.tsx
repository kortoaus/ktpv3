import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 border-b flex items-center h-16 px-8 gap-4">
        <Link href="/" prefetch={false}>
          <button className="BasicBtn">Go Home</button>
        </Link>
        <h1>Buffet Class</h1>
      </div>
      {children}
    </div>
  );
}
