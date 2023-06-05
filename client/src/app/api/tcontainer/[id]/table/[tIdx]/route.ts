import apiURL from "@/libs/apiURL";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: {
    params: {
      id: string;
      tIdx: string;
    };
  }
) {
  const { id, tIdx } = context.params;

  const key = cookies().get("accessToken")?.value || "";

  if (!key) {
    return NextResponse.json({
      ok: false,
      msg: "Unauthorized!(c)",
    });
  }

  const data = await fetch(`${apiURL}/v1/table/container/${id}/table/${tIdx}`, {
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

export async function GET(
  req: NextRequest,
  context: {
    params: {
      id: string;
      tIdx: string;
    };
  }
) {
  const { id, tIdx } = context.params;

  const key = cookies().get("accessToken")?.value || "";

  if (!key) {
    return NextResponse.json({
      ok: false,
      msg: "Unauthorized!(c)",
    });
  }

  const data = await fetch(`${apiURL}/v1/table/container/${id}/table/${tIdx}`, {
    method: "GET",
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
