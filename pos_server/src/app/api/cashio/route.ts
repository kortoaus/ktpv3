import { getData } from "@/libs/apiURL";
import { convertIP } from "@/libs/util";
import { headers } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const rawIp = headers().get(`x-forwarded-for`) || "";
  const key = convertIP(rawIp);

  const data = await getData(
    `/cashio`,
    key,
    "POST",
    JSON.stringify(await req.json())
  );

  return NextResponse.json({ ...data });
}
