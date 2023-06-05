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
