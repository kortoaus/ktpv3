import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div>
      <div className="h-16 border-b mb-4 px-8 flex items-center">
        <Link href="/" prefetch={false}>
          <button>
            <h4>Home</h4>
          </button>
        </Link>
      </div>

      {/* Note */}
      <div>{children}</div>
    </div>
  );
}
