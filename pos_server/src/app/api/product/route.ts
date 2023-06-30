import apiURL from "@/libs/apiURL";
import { convertIP } from "@/libs/util";
import { headers } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const rawIp = headers().get(`x-forwarded-for`) || "";
  const key = convertIP(rawIp);

  const data = await fetch(encodeURI(`${apiURL}/product`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `BearerIP ${key}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
