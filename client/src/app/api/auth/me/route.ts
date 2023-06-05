import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

const apiURL = process.env.API_URL || "";

export async function GET(req: NextRequest) {
  const key = cookies().get("accessToken")?.value || "";

  const data = await fetch(`${apiURL}/v1/auth/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
