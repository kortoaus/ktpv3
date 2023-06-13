import apiURL from "@/libs/apiURL";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const key = cookies().get("accessToken")?.value || "";

  const data = await fetch(
    encodeURI(`${apiURL}/v1/category?page=${page}&keyword=${keyword}`),
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

export async function POST(req: NextRequest) {
  const key = cookies().get("accessToken")?.value || "";

  if (!key) {
    return NextResponse.json({
      ok: false,
      msg: "Unauthorized!(c)",
    });
  }

  const data = await fetch(`${apiURL}/v1/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(await req.json()),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return NextResponse.json({ ...data });
}
