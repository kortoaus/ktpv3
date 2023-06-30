import apiURL from "@/libs/apiURL";
import { convertIP } from "@/libs/util";
import { headers } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = +context.params.id || 0;
  const rawIp = headers().get(`x-forwarded-for`) || "";
  const key = convertIP(rawIp);

  const data = await fetch(encodeURI(`${apiURL}/product/${id}/oos`), {
    method: "POST",
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
