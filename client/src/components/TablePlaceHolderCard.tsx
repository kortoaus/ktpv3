import React from "react";

export default function TablePlaceHolderCard() {
  return (
    <div className="fccc overflow-hidden h-14 border rounded-md text-sm opacity-25">
      {/* {`Table ${index}`} */}
    </div>
  );
}

export function TableExistCard({ table }: { table: string }) {
  return (
    <div className="fccc overflow-hidden h-14 border rounded-md text-sm border-black">
      {`${table}`}
    </div>
  );
}

export function TableBtn({
  table,
  className = "",
  selected = false,
  handler,
}: {
  table: string;
  className?: string;
  selected: boolean;
  handler: () => void;
}) {
  return (
    <div
      onClick={() => handler()}
      className={`fccc hover:cursor-pointer overflow-hidden h-14 border rounded-md text-sm border-black ${
        selected ? "bg-blue-500 text-white" : ""
      } ${className ? className : ""}`}
    >
      {`${table}`}
    </div>
  );
}
