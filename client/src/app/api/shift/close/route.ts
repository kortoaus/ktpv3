import apiURL from "@/libs/apiURL";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const key = cookies().get("accessToken")?.value || "";

  if (!key) {
    return NextResponse.json({
      ok: false,
      msg: "Unauthorized!(c)",
    });
  }

  const data = await fetch(`${apiURL}/v1/shift/close`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(await req.json()),
  })
    .then((res) => {
      cookies().delete("accessToken");
      return res.json();
    })
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
