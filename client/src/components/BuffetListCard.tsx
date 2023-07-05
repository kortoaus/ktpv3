import { BuffetClass } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  data: BuffetClass;
};

export default function BuffetListCard({
  data: {
    id,
    name,
    stayTime,
    orderTime,
    nameA,
    priceA,
    h_priceA,
    nameB,
    priceB,
    h_priceB,
    nameC,
    priceC,
    h_priceC,
    archived,
  },
}: Props) {
  return (
    <div
      className={`border rounded-md mb-4 overflow-hidden shadow-md ${
        archived ? "opacity-50" : ""
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between bg-blue-500 text-white">
        <h3>{name}</h3>
        <Link
          href={`/buffet/${id}`}
          prefetch={false}
          className="bg-white text-blue-500 px-2 py-1 rounded-md"
        >
          Update
        </Link>
      </div>

      <div className="p-4">
        {/* <h3 className="mb-2">Pricing</h3> */}
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th>Pricing</th>
              <th>Normal Price</th>
              <th>Holiday Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{nameA}</td>
              <td className="number">${priceA.toFixed(2)}</td>
              <td className="number">${h_priceA.toFixed(2)}</td>
            </tr>
            <tr>
              <td>{nameB}</td>
              <td className="number">${priceB.toFixed(2)}</td>
              <td className="number">${h_priceB.toFixed(2)}</td>
            </tr>
            <tr>
              <td>{nameC}</td>
              <td className="number">${priceC.toFixed(2)}</td>
              <td className="number">${h_priceC.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-right mt-2 font-medium text-sm">{`Order: ${orderTime}mins, Stay: ${stayTime}mins`}</p>
      </div>
    </div>
  );
}
