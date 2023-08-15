import apiURL from "@/libs/apiURL";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const key = cookies().get("accessToken")?.value || "";

  const data = await fetch(
    encodeURI(`${apiURL}/v1/sale/cashio?page=${page}&keyword=${keyword}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
